const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    // Instead of jsonwebtoken, we use Supabase's native token verification
    // This perfectly handles any algorithm (HS256 or RS256) Supabase is using
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      throw new Error(error?.message || 'Invalid user token');
    }
    
    // Map the Supabase user object to what our routes expect
    req.user = {
      sub: user.id,
      email: user.email
    };
    
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
};

module.exports = verifyToken;
