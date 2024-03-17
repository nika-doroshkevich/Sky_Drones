import EventBus from "./EventBus";

const handleError = (error: {
    response: { data: { detail: any; }; status: number; };
    message: any;
    toString: () => any;
}, setState: (arg: (prevState: any) => any) => void) => {
    const resMessage = error.response?.data?.detail || error.message || error.toString();
    console.log("Error: " + resMessage);
    setState((prevState) => ({
        ...prevState,
        successful: false,
        message: resMessage,
    }));

    if (error.response && error.response.status === 401) {
        EventBus.dispatch("logout");
    }
};

export default handleError;
