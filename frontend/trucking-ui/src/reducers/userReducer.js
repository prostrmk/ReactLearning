import {AUTH_SUCCESS} from "../constants/userActionType";

export default (state = [], action) => {

    switch (action.type) {
        case AUTH_SUCCESS:
            console.log(action.payload);
            return [
                {
                    userRole: action.payload[0],
                    token: action.payload[1],
                    userId: action.payload[2],
                    companyId: action.payload[3]
                }
            ];
        default:
            return state;
    }

}