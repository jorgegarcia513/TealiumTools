// Check if we are on TiQ
function inTealium() {
    var url = document.URL.toLowerCase();
    return (url.indexOf('.tealiumiq.com/tms') > 0);
}

function downloadCSV(csvContents) {
    // Create a Blob with the CSV data and type
    const blob = new Blob([csvContents], { type: 'text/csv;charset=utf-8,' });
        
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create an anchor tag for downloading
    const a = document.createElement('a');

    // Set the URL and download attribute of the anchor tag
    a.href = url;
    a.download = 'download.csv';
    
    // Trigger the download by clicking the anchor tag
    // a.click();
}

function convertToCSV(data) {
    // Get the keys (headers) of the object
    var refinedData = []
    const headers = Object.keys(data[0]);

    refinedData.push(headers);

    // Get the values of the object
    data.forEach(row => {
        refinedData.push(Object.values(row))
    });

    var csvContents = '';
    refinedData.forEach(row => {
        csvContents += row.join(',') + '\n';
    });

    console.log(csvContents);

    // Join the headers and values with commas and newlines to create the CSV string
    return csvContents;
}

var Tag = {
    getName: function(tag) {
        return tag.tag_name;
    },

    getUID: function(tag) {
        return tag._id;
    },

    getTitle: function(tag) {
        return tag.title.replace(',', '/');
    },

    getEnvironments: function(tag) {
        var environments = '';

        for (const [key, value] of Object.entries(tag.selectedTargets)) {
            if (value) {
                environments += key + ' | ';
            }
        }

        environments = environments.substring(0, environments.length - 1);

        return environments;
    }
}

function getTags() {
    var data = [];
    for (const [key, value] of Object.entries(utui.data.manage)) {
        data.push({
            "UID": Tag.getUID(value),
            "Name": Tag.getName(value),
            "Title": Tag.getTitle(value),
            "Publish Environments": Tag.getEnvironments(value)
        });
    }
    return data;
}

function getProfiles() {
    utui.service.get(utui.service.restapis.GET_PROFILES, { account: account, profile: "main",tool: "tt-tag_audit" });
}

const data = getTags();
const profiles = getProfiles();
const account = utui.login.account;

if (inTealium) {
    tealiumTools.send({ account: account, processing: false });

    var csv = convertToCSV(data)

    downloadCSV(csv);
}
