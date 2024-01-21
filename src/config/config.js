import dotenv from 'dotenv'

dotenv.config()

export default{
    
    mongoUrl: process.env.MONGO_URL,
    githubClient: process.env.GITHUB_CLIENT_ID,
    githubSecret: process.env.GITHUB_SECRET,
    githubCallback: process.env.GITHUB_CALLBACK_URL,
    sessionSecret: process.env.SESSION_SECRET,
    PORT: process.env.PORT,
    gmailUser: process.env.GMAIL_USER,
    gmailPass: process.env.GMAIL_PASS,

}
