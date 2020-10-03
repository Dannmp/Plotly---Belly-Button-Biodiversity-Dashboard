function getPlot(id) {

    // get the data
    d3.json("static/data/samples.json").then((data) => {
        console.log(data)

     
        var metadata = data.metadata;

        console.log(metadata)

        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        console.log(result.wfreq)


        // filter sample values by id 
        var samples = data.samples.filter(s => s.id.toString() === id)[0];

        console.log(samples);

        // get only top 10 sample
        var sampleValues = samples.sample_values.slice(0, 10).reverse();

        // get only top 10 otu ids
        var idValues = (samples.otu_ids.slice(0, 10)).reverse();

        // get the otu id's 
        var idOtu = idValues.map(d => "OTU " + d)

        console.log(`OTU IDS: ${idOtu}`)

        // get the top 10 labels
        var labels = samples.otu_labels.slice(0, 10);

        console.log(`Sample Values: ${sampleValues}`)

        console.log(`Id Values: ${idValues}`)


        //trace variable 
        var trace = {
            x: sampleValues,
            y: idOtu,
            text: labels,
            marker:{
                color: 'rgba(55,128,191,0.6)',
                width: 1
            },
            type: "bar",
            orientation: "h",
        };

        // create data variable
        var data = [trace];

        // create layout variable
        var layout = {
            title: "<b>Top 10 OTU</b>",
            yaxis: {
                tickmode: "linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 30,
                b: 20
            }
        };

        // create the bar plot
        Plotly.newPlot("bar", data, layout);

       
        // create the trace for the bubble chart
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels

        };

        // set the layout for the bubble plot
        var layout = {
            xaxis: { title: "OTU ID" },
            height: 600,
            width: 1300
        };

        // create the data variable 
        var data1 = [trace1];

        // create the bubble plot
        Plotly.newPlot("bubble", data1, layout);

        // create gauge chart
        var data2 = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: result.wfreq,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
            type: "indicator",
            mode: "gauge+number",
            delta: { reference: 5 },
            gauge: {
                axis: { range: [null, 9], tickwidth:1, tickcolor:"darkblue"},
                bar: {color: "blue"},
                shapes: [
                    {
                        type: 'path',
                        path: 'M 0.235 0.5 L 0.24 0.62 L 0.245 0.5 Z',
                        fillcolor: 'rgba(44, 160, 101, 0.5)',
                        line: {
                            'width': 0.5
                        },
                        xref: 'paper',
                        yref: 'paper'
                    }
                ],
                steps: [
                    { range: [0, 1], color: "IndianRed" },
                    { range: [1, 2], color: "LightCoral" },
                    { range: [2, 3], color: "Salmon" },
                    { range: [3, 4], color: "Pink" },
                    { range: [4, 5], color: "DarkSalmon" },
                    { range: [5, 6], color: "LightSalmon" },
                    { range: [6, 7], color: "Crimson" },
                    { range: [7, 8], color: "FireBrick" },
                    { range: [8, 9], color: "DarkRed" },
                    
                ],
                threshold: {
                    line: { color: "red", width: 4 },
                    thickness: 0.75,                    
                    value: 5
                }
            }
        }];

        var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
        
        //Create the Gauge Chart
        Plotly.newPlot('gauge', data2, layout);

    });
}


function getInfo(id) {
   
    d3.json("static/data/samples.json").then((data) => {

        //metadata information 
        var metadata = data.metadata;

        console.log(metadata)

        // filter meta data
        var result = metadata.filter(meta => meta.id.toString() === id)[0];
  
        var demographicInfo = d3.select("#sample-metadata");
       
        demographicInfo.html("");
        
        Object.entries(result).forEach((key) => {
            demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
        });
    });
}

// create function
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}


function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("static/data/samples.json").then((data) => {
        console.log(data)

        // get info for dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();