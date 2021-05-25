import axios from 'axios';

export const clearRemoteTests = async (port?: number): Promise<void> => {
    try { 
        const _port = port ?? process.env.MALABI_PORT;
        if (_port) throw new Error('Need to provide port');

        await axios.delete(`http://localhost:${_port}/malabi/spans`, {
            transformResponse: (res) => {
                return res;
            }
        });
    } catch (err) {
        console.log('error while deleting remote spans', err);
    }
}

