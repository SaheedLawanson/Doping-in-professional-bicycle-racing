// Define variables
const width = 800;
const height = 600;
const padding = 60;

const svg = d3.select('svg')
                .attr('width', width)
                .attr('height', height)

// API link
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
let req = new XMLHttpRequest()

let dataset

let xAxis; let yAxis

let xAxisScale; let yAxisScale
let xScale; let yScale

// Build scales to be used for building axes
let buildScales = () => {

    xScale = d3.scaleLinear()
    xScale.domain([d3.min(dataset, d => d.Year)-1,
                    d3.max(dataset, d => d.Year)+1])
            .range([padding, width - padding])

    data = dataset.map(d => new Date(d.Seconds*1000))
    yScale = d3.scaleTime()
    yScale.domain([d3.min(data), d3.max(data)])
            .range([padding, (height - padding)])

    
}

// Build Axes x and y on which to plot using the scale
let buildAxes = () => {
    // Draw the x-axis
    xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format('d'))
    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, '+(height-padding)+')')

    // Draw the y-axis
    yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.timeFormat('%M:%S'))
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate('+padding+', 0)')
}
// Creates tooltip
let tooltip = d3.select('body').append('div')
                .attr('id', 'tooltip')
        
// Plot the data using scatter plot
let drawCircles = () => {
    svg.selectAll('circle')

        // Draw dots for each data
        .data(dataset)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('data-xvalue', d => d.Year)
        .attr('data-yvalue', d => new Date(d.Seconds*1000))

        // dimensions and coordinates for each dot
        .attr('cx', d => xScale(d.Year))
        .attr('cy', d => yScale(new Date(d.Seconds*1000)))
        .attr('r', 5)

        // Color each dot blue if the character was found guilty of doping
        // other wise yellow
        .attr('fill', d => d.Doping == ""? 'rgb(255,153,62)':'rgb(40,124,183)')

        // Make tooltip visible on mouse over event
        .on('mouseover', d => {
            tooltip.transition()
                    .style('visibility', 'visible')
            d = d.srcElement.__data__
            tooltip.text(
                d.Name+": "+d.Nationality+"\nYear: "+d.Year+" Time: "+d.Time+"\n\n"+d.Doping
            )

            tooltip.attr('data-year', d.Year)
        })

        // Hide tooltip on mouse out event
        .on('mouseout', d => {

            tooltip.transition()
                    .style('visibility', 'hidden')
        })

}

// Pull API
req.open('GET', url, true)
req.send()
req.onload = () => {
    dataset = JSON.parse(req.responseText)

    // Run pipeline
    buildScales()

    buildAxes()

    drawCircles()
}