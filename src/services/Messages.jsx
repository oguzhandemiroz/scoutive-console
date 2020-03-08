import { fatalSwal, errorSwal, Toast } from "../components/Alert.jsx";
import ep from "../assets/js/urls";
import { getCookie } from "../assets/js/core.js";
import { CheckPermissions } from "./Others.jsx";

const h = new Headers();
h.append("Content-Type", "application/json");
h.append("XIP", getCookie("IPADDR"));
h.append("Authorization", localStorage.getItem("UID"));

const CreateRecipient = data => {
    try {
        return fetch(ep.RECIPIENT_CREATE, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);
                    else {
                        Toast.fire({
                            type: "success",
                            title: status.description,
                            timer: 2500
                        });
                    }
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const ListMessageTemplates = () => {
    try {
        if (!CheckPermissions(["m_read"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.MESSAGES_TEMPLATES_LIST, {
            method: "POST",
            body: JSON.stringify({
                uid: localStorage.getItem("UID")
            }),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const CreateMessageTemplate = data => {
    try {
        return fetch(ep.MESSAGES_TEMPLATES_CREATE, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const GetMessageTemplate = data => {
    try {
        return fetch(ep.MESSAGES_TEMPLATES_DETAIL, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const UpdateMessageTemplate = data => {
    try {
        return fetch(ep.MESSAGES_TEMPLATES_UPDATE, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);
                    else {
                        Toast.fire({
                            type: "success",
                            title: status.description,
                            timer: 2500
                        });
                    }
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const ActivateMessageTemplate = () => {
    try {
        if (!CheckPermissions(["m_read"])) {
            return Promise.resolve(null);
        }
        
        return fetch(ep.MESSAGES_TEMPLATES_ACTIVATE, {
            method: "POST",
            body: JSON.stringify({
                uid: localStorage.getItem("UID")
            }),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);
                    else {
                        Toast.fire({
                            type: "success",
                            title: status.description,
                            timer: 2500
                        });
                    }
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const CreateCampaign = data => {
    try {
        if (!CheckPermissions(["m_write"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.CAMPAIGN_CREATE, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);
                    else {
                        Toast.fire({
                            type: "success",
                            title: status.description,
                            timer: 2500
                        });
                    }
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const CancelCampaign = data => {
    try {
        return fetch(ep.CAMPAIGN_CANCEL, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);
                    else {
                        Toast.fire({
                            type: "success",
                            title: status.description,
                            timer: 2500
                        });
                    }
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const ToggleStatusCampaign = data => {
    try {
        return fetch(ep.CAMPAIGN_STATUS_TOGGLE, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);
                    else {
                        Toast.fire({
                            type: "success",
                            title: status.description,
                            timer: 2500
                        });
                    }
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const DetailCampaign = data => {
    try {
        if (!CheckPermissions(["m_read"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.CAMPAIGN_DETAIL, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const SendTestMessages = data => {
    try {
        if (!CheckPermissions(["m_write"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.MESSAGES_SEND_TEST, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);
                    else {
                        Toast.fire({
                            type: "success",
                            title: status.description,
                            timer: 2500
                        });
                    }
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const ListStaticSegments = () => {
    try {
        if (!CheckPermissions(["m_read"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.SEGMENTS_STATIC_LIST, {
            method: "POST",
            body: JSON.stringify({
                uid: localStorage.getItem("UID")
            }),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const CreateSegment = data => {
    try {
        if (!CheckPermissions(["m_write"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.SEGMENT_CREATE, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);
                    else {
                        Toast.fire({
                            type: "success",
                            title: status.description,
                            timer: 2500
                        });
                    }
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const ListPersonMessages = data => {
    try {
        return fetch(ep.MESSAGES_LIST_PERSON_MESSAGES, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const CreateMessage = data => {
    try {
        if (!CheckPermissions(["m_write"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.MESSAGES_CREATE, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);
                    else {
                        Toast.fire({
                            type: "success",
                            title: status.description,
                            timer: 2500
                        });
                    }
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

export {
    CreateRecipient,
    ListMessageTemplates,
    GetMessageTemplate,
    UpdateMessageTemplate,
    ActivateMessageTemplate,
    CreateCampaign,
    CancelCampaign,
    DetailCampaign,
    CreateMessageTemplate,
    SendTestMessages,
    ListStaticSegments,
    CreateSegment,
    ToggleStatusCampaign,
    ListPersonMessages,
    CreateMessage
};
