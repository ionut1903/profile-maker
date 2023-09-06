export const getPDF = async (profile_url) => {
    const { fetch } = window;
    const request = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/pdf'
        },
    }

    const response = await fetch(`/api/getpdfsource/?profile=${profile_url}`, request);
    const blob = await response.blob()
    const lastModified = (new Date(response.headers.get('Last-Modified'))).toISOString().substring(0, 10);
    return { blob, lastModified };

}