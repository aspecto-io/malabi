export const clearRemoteTests = async (portOrBaseUrl: string | number): Promise<void> => {
    try {
        const baseUrl = typeof portOrBaseUrl === 'string' ? portOrBaseUrl : `http://localhost:${portOrBaseUrl}`;
        await require('axios').delete(`${baseUrl}/malabi/spans`, {
            transformResponse: (res) => {
                return res;
            },
        });
    } catch (err) {
        console.log('error while deleting remote spans', err);
    }
};
