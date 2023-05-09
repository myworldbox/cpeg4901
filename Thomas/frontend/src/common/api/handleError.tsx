export default function handleErrorResponse(errorStatus: number, errorContent: any) {
    if (errorStatus == 401) {
        // Unauthorize Request
        return {
            redirect: {
                permanent: false,
                destination: `/login`,
            },
        };
    } else if (errorStatus == 408) {
        // Request Timeout
        return {
            redirect: {
                permanent: false,
                destination: `/error?code=${errorStatus}&reason=Request Timeout(5000ms).`,
            },
        };
    } else if (errorStatus < 500){
        // Other Error
        return {
            redirect: {
                permanent: false,
                destination: `/error?code=${errorStatus}&reason=${errorContent.reason}.`,
            },
        };
    } else {
        // Server Error
        return {
            redirect: {
                permanent: false,
                destination: `/error?code=${errorStatus}&reason=Unknown Server Error`,
            },
        };
    }
}