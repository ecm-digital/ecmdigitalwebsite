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

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            console.error('Supabase login error:', error);
            return res.status(error.status || 401).json({ message: 'Invalid login credentials.' });
        }

        // On success, Supabase client-side library handles the session.
        // We just confirm success to the client.
        return res.status(200).json({ message: 'Login successful', user: data.user });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ message: 'An internal server error occurred.' });
    }
};
