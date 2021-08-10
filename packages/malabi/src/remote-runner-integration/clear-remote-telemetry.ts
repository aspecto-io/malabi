interface ClearRemoteTelemetryProps {
    portOrBaseUrl: string | number;
}

/**
 * Clears the spans from the exposed malabi spans endpoint
 * @category Main Functions
 * @param fetchRemoteTelemetryProps Props for clearing remote telemetry
 * @param fetchRemoteTelemetryProps.portOrBaseUrl port number, or entire base url, where the endpoint is hosted at.
 */
const clearRemoteTelemetry = async ({ portOrBaseUrl } : ClearRemoteTelemetryProps): Promise<void> => {
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

export default clearRemoteTelemetry;
