const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    const { blogDraft, seoPack } = JSON.parse(event.body);
    
    const timestamp = new Date().toISOString();
    const slug = blogDraft.slug;
    
    // Save blog draft to S3
    const blogKey = `blog-drafts/${slug}/${timestamp}-draft.mdx`;
    await s3.putObject({
      Bucket: process.env.CMS_BUCKET,
      Key: blogKey,
      Body: JSON.stringify(blogDraft, null, 2),
      ContentType: 'application/json'
    }).promise();
    
    // Save SEO pack
    const seoKey = `seo-packs/${slug}/${timestamp}-seo.json`;
    await s3.putObject({
      Bucket: process.env.CMS_BUCKET,
      Key: seoKey,
      Body: JSON.stringify(seoPack, null, 2),
      ContentType: 'application/json'
    }).promise();
    
    // Trigger website revalidation
    if (process.env.REVALIDATE_URL && process.env.REVALIDATE_SECRET) {
      const revalidateResponse = await fetch(process.env.REVALIDATE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REVALIDATE_SECRET}`
        },
        body: JSON.stringify({
          slug: `/blog/${slug}`,
          secret: process.env.REVALIDATE_SECRET
        })
      });
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        blogDraftUrl: `s3://${process.env.CMS_BUCKET}/${blogKey}`,
        seoPackUrl: `s3://${process.env.CMS_BUCKET}/${seoKey}`,
        slug
      })
    };
    
  } catch (error) {
    console.error('Error saving blog draft:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
