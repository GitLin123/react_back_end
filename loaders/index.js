import expressLoader from './express.js';

export default {
    init: async ({ expressApp }) => {
        await expressLoader({ app: expressApp });
        console.log('Express Initialized');
    }
};