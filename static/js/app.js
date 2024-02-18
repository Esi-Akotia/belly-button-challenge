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
        buildMetadata(firstSample);
    
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

        // Build bubble chart
        let bubbleData = [{
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: "Earth"
            }
        }];

        let bubbleLayout = {
            title: "OTU Bubble Chart",
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Sample Value" },
            showlegend: false,
            height: 600,
            width: 1000
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
}

// Function to display metadata
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        let metadata = data.metadata;
        let resultArray = metadata.filter(obj => obj.id == sample);
        let result = resultArray[0];

        // Clear existing metadata
        let metadataPanel = d3.select("#sample-metadata");
        metadataPanel.html("");

        // Append each key-value pair to the panel
        Object.entries(result).forEach(([key, value]) => {
            metadataPanel.append("p").text(`${key}: ${value}`);
        });
    });
}

// Function to handle dropdown menu change
function optionChanged(newSample) {
    // Update charts and metadata for new sample
    buildCharts(newSample);
    buildMetadata(newSample);
}

// Initialize the dashboard
init();
