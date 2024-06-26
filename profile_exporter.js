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
    a.click();
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
    getTagName: function(tag) {
        return tag.tag_name;
    },

    getTagUID: function(tag) {
        return tag._id;
    },

    getTagTitle: function(tag) {
        return tag.title.replace(',', '/');
    },

    getTagEnvironments: function(tag) {
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
            "UID": Tag.getTagUID(value),
            "Name": Tag.getTagName(value),
            "Title": Tag.getTagTitle(value),
            "Publish Environments": Tag.getTagEnvironments(value)
        });
    }
    return data;
}

if (inTealium) {
    var data = getTags()
    var csv = convertToCSV(data)
    console.log(csv);
    downloadCSV(csv);
}
