import axios from 'axios';
import { contactInfo } from '../about-me.js';

async function getGithubUserInfo(username) {
    try {
        const response = await axios.get(`https://api.github.com/users/${username}`);
        const { name, bio, email } = response.data;

        const socialLinks = bio.match(/https?:\/\/[^\s]+/g) || [];
        const tg = socialLinks.filter((link) => link.includes('t.me'));
        return { name, bio, email, tg };
    } catch (error) {
        console.error('Error fetching GitHub user info:', error);
        return { name: null, bio: null, email: null };
    }
}

async function updateSheet(prNumber, status, duration, userInfo) {
    // if (status === 'failure' || contactInfo.bio.length < 50) {
        // return;
    // } 
    
    try {
        await axios.post('http://164.90.212.8:3000/update-sheet', {
            prNumber: prNumber,
            status: status === 'success' ? '✅' : '❌',
            duration: `${duration} c`,
            contactInfo: {
                name: contactInfo.name || 'N/A',
                bio: contactInfo.bio || 'N/A',
                email: contactInfo.email || 'N/A',
                phoneNumber: contactInfo.phoneNumber || 'N/A',
            }
        })
    } catch (error){
        console.error(error)
    }
}

const [,, prNumber, status, duration, username] = process.argv;

getGithubUserInfo(username)
    .then(userInfo => updateSheet(prNumber, status, duration, userInfo))
    .catch(err => console.error('Error:', err));