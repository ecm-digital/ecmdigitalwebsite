#!/usr/bin/env python3
"""
AWS Services Upload Script for ECM Digital
Uploads services analysis to AWS DynamoDB and S3
"""

import boto3
import json
import os
from datetime import datetime
from botocore.exceptions import ClientError

class ECMServicesUploader:
    def __init__(self):
        """Initialize AWS clients"""
        self.dynamodb = boto3.resource('dynamodb', region_name='eu-west-1')
        self.s3 = boto3.client('s3', region_name='eu-west-1')
        self.bucket_name = 'ecm-digital-services'
        
    def create_dynamodb_table(self):
        """Create DynamoDB table for services if it doesn't exist"""
        try:
            table = self.dynamodb.create_table(
                TableName='ECMServices',
                KeySchema=[
                    {
                        'AttributeName': 'service_id',
                        'KeyType': 'HASH'  # Partition key
                    }
                ],
                AttributeDefinitions=[
                    {
                        'AttributeName': 'service_id',
                        'AttributeType': 'S'
                    }
                ],
                BillingMode='PAY_PER_REQUEST'
            )
            print("✅ DynamoDB table 'ECMServices' created successfully")
            return table
        except ClientError as e:
            if e.response['Error']['Code'] == 'ResourceInUseException':
                print("ℹ️ Table 'ECMServices' already exists")
                return self.dynamodb.Table('ECMServices')
            else:
                print(f"❌ Error creating table: {e}")
                return None
    
    def upload_to_dynamodb(self, services_data):
        """Upload services data to DynamoDB"""
        table = self.dynamodb.Table('ECMServices')
        
        print("🔄 Uploading services to DynamoDB...")
        
        for service_id, service_data in services_data['services'].items():
            try:
                # Add metadata
                service_data['upload_date'] = datetime.now().isoformat()
                service_data['company'] = services_data['metadata']['company']
                service_data['version'] = services_data['metadata']['version']
                
                # Upload to DynamoDB
                table.put_item(Item=service_data)
                print(f"✅ Uploaded: {service_data['name']}")
                
            except ClientError as e:
                print(f"❌ Error uploading {service_id}: {e}")
        
        print("✅ DynamoDB upload completed!")
    
    def upload_to_s3(self, services_data):
        """Upload services analysis to S3"""
        try:
            # Create bucket if it doesn't exist
            try:
                self.s3.create_bucket(
                    Bucket=self.bucket_name,
                    CreateBucketConfiguration={'LocationConstraint': 'eu-west-1'}
                )
                print(f"✅ S3 bucket '{self.bucket_name}' created")
            except ClientError as e:
                if e.response['Error']['Code'] == 'BucketAlreadyOwnedByYou':
                    print(f"ℹ️ S3 bucket '{self.bucket_name}' already exists")
                else:
                    print(f"⚠️ S3 bucket creation warning: {e}")
            
            # Upload JSON file
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            key = f"services-analysis/services-analysis-{timestamp}.json"
            
            self.s3.put_object(
                Bucket=self.bucket_name,
                Key=key,
                Body=json.dumps(services_data, indent=2, ensure_ascii=False),
                ContentType='application/json'
            )
            
            print(f"✅ Uploaded to S3: s3://{self.bucket_name}/{key}")
            
            # Upload latest version
            self.s3.put_object(
                Bucket=self.bucket_name,
                Key="services-analysis/latest.json",
                Body=json.dumps(services_data, indent=2, ensure_ascii=False),
                ContentType='application/json'
            )
            
            print(f"✅ Updated latest version: s3://{self.bucket_name}/services-analysis/latest.json")
            
        except ClientError as e:
            print(f"❌ Error uploading to S3: {e}")
    
    def create_analytics_dashboard(self, services_data):
        """Create analytics summary for business intelligence"""
        analytics = {
            "summary": {
                "total_services": len(services_data['services']),
                "high_priority_services": len([s for s in services_data['services'].values() if s['priority'] == 'High']),
                "medium_priority_services": len([s for s in services_data['services'].values() if s['priority'] == 'Medium']),
                "categories": list(set([s['category'] for s in services_data['services'].values()])),
                "analysis_date": datetime.now().isoformat()
            },
            "category_breakdown": {},
            "technology_usage": {},
            "business_insights": {
                "top_growth_areas": services_data['businessAnalysis']['growthAreas'],
                "competitive_advantages": services_data['businessAnalysis']['competitiveAdvantages'],
                "recommendations": services_data['recommendations']
            }
        }
        
        # Category breakdown
        for service in services_data['services'].values():
            category = service['category']
            if category not in analytics['category_breakdown']:
                analytics['category_breakdown'][category] = []
            analytics['category_breakdown'][category].append({
                'id': service['id'],
                'name': service['name'],
                'priority': service['priority']
            })
        
        # Technology usage analysis
        all_technologies = []
        for service in services_data['services'].values():
            if 'technologies' in service:
                all_technologies.extend(service['technologies'])
        
        from collections import Counter
        tech_counter = Counter(all_technologies)
        analytics['technology_usage'] = dict(tech_counter.most_common())
        
        return analytics
    
    def upload_analytics(self, analytics_data):
        """Upload analytics data to DynamoDB"""
        try:
            table = self.dynamodb.Table('ECMAnalytics')
            
            # Create analytics table if it doesn't exist
            try:
                analytics_table = self.dynamodb.create_table(
                    TableName='ECMAnalytics',
                    KeySchema=[
                        {
                            'AttributeName': 'analysis_id',
                            'KeyType': 'HASH'
                        }
                    ],
                    AttributeDefinitions=[
                        {
                            'AttributeName': 'analysis_id',
                            'AttributeType': 'S'
                        }
                    ],
                    BillingMode='PAY_PER_REQUEST'
                )
                print("✅ DynamoDB table 'ECMAnalytics' created successfully")
            except ClientError as e:
                if e.response['Error']['Code'] == 'ResourceInUseException':
                    print("ℹ️ Table 'ECMAnalytics' already exists")
                else:
                    print(f"⚠️ Analytics table creation warning: {e}")
            
            # Upload analytics
            analytics_data['analysis_id'] = f"analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            analytics_data['upload_date'] = datetime.now().isoformat()
            
            table.put_item(Item=analytics_data)
            print("✅ Analytics uploaded to DynamoDB")
            
        except ClientError as e:
            print(f"❌ Error uploading analytics: {e}")
    
    def run_upload(self):
        """Main upload process"""
        print("🚀 Starting ECM Digital Services Upload to AWS...")
        
        # Load services data
        try:
            with open('services-analysis.json', 'r', encoding='utf-8') as f:
                services_data = json.load(f)
            print("✅ Services data loaded successfully")
        except FileNotFoundError:
            print("❌ services-analysis.json not found!")
            return
        except json.JSONDecodeError as e:
            print(f"❌ Invalid JSON: {e}")
            return
        
        # Create DynamoDB tables
        self.create_dynamodb_table()
        
        # Upload services to DynamoDB
        self.upload_to_dynamodb(services_data)
        
        # Upload to S3
        self.upload_to_s3(services_data)
        
        # Create and upload analytics
        analytics = self.create_analytics_dashboard(services_data)
        self.upload_analytics(analytics)
        
        print("\n🎉 Upload completed successfully!")
        print(f"📊 Total services uploaded: {len(services_data['services'])}")
        print(f"🔍 Analytics generated and uploaded")
        print(f"📁 Data available in S3: s3://{self.bucket_name}/")

def main():
    """Main function"""
    uploader = ECMServicesUploader()
    uploader.run_upload()

if __name__ == "__main__":
    main()


