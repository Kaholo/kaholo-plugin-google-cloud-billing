const { google } = require('googleapis');
const { JWT } = require('google-auth-library');

function updateBillingInfo(action, settings) {

    let cloudbilling = google.cloudbilling('v1');
    let resourceName = action.params.RESOURCENAME;
    let billingAccountName = action.params.BILLINGACCOUNTNAME;

    let keysParam = action.params.CREDENTIALS || settings.CREDENTIALS
    let keys;

    if (typeof keysParam != 'string'){
        keys = keysParam;
    } else {
        try{
            keys = JSON.parse(keysParam)
        }catch(err){
            return Promise.reject("Invalid credentials JSON");
        }
    }


    return new Promise((resolve, reject) => {
        const client = new JWT(
            keys.client_email,
            null,
            keys.private_key,
            ['https://www.googleapis.com/auth/cloud-platform'],
        );

        let request = {
            name: resourceName,
            resource: {
                billingAccountName: 'billingAccounts/' + billingAccountName,
                },
            auth: client,
        };

        cloudbilling.projects.updateBillingInfo(request, (err, response) => {
            if (err)
                return reject(err);

            resolve(response);
        })
    })
}

module.exports = {
    updateBillingInfo : updateBillingInfo,
}