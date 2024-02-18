// Write a function to initialize the dashboard
function init() {
    // Load data from samples.json
    d3.json("samples.json").then((data) => {
        // Get reference to dropdown menu
        let dropdownMenu = d3.select("#selDataset");

        // Populate dropdown with sample names
        data.names.forEach((sample) => {
            dropdownMenu.append("option").text(sample).property("value", sample);
        });

        // Display charts and metadata for the first sample
        let firstSample = data.names[0];
        buildCharts(firstSample);
    
    });
}

// Write a function to build charts
function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        let samples = data.samples;
        let resultArray = samples.filter(obj => obj.id == sample);
        let result = resultArray[0];

        let otuIds = result.otu_ids;
        let sampleValues = result.sample_values;
        let otuLabels = result.otu_labels;

        // Build bar chart
        let barData = [{
            y: otuIds.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse(),
            x: sampleValues.slice(0, 10).reverse(),
            text: otuLabels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        }];

        let barLayout = {
            title: "Top 10 OTUs",
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot("bar", barData, barLayout);
    });
}
