import { IgApiClient } from 'instagram-private-api';

// Authenticate with Instagram
const ig = new IgApiClient();
ig.state.generateDevice('andre154638856');
const connectToInsta=async()=>{
    await ig.simulate.preLoginFlow();
    const loggedInUser = await ig.account.login('andre154638856', 'password1141');
    console.log("logdin user",loggedInUser)
    await ig.simulate.postLoginFlow();
}



export const instaAcess={
    ig,connectToInsta
};
