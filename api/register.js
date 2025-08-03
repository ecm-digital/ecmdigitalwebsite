const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            console.error('Supabase registration error:', error);
            return res.status(error.status || 500).json({ message: error.message });
        }

        return res.status(201).json({ message: 'User created successfully. Please check your email to confirm your account.' });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ message: 'An internal server error occurred.' });
    }
};
