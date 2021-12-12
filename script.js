// Define variables
const width = 800;
const height = 600;
const padding = 60;

const svg = d3.select('svg')
                .attr('width', width)
                .attr('height', height)

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
let req = new XMLHttpRequest()

let dataset

let xAxis; let yAxis

let xAxisScale; let yAxisScale
let xScale; let yScale


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

// Build Axes
let buildAxes = () => {
    xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format('d'))
    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, '+(height-padding)+')')

    yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.timeFormat('%M:%S'))
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate('+padding+', 0)')
}
// Draw circles
let tooltip = d3.select('#tooltip')
                
let drawCircles = () => {
    svg.selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('data-xvalue', d => d.Year)
        .attr('data-yvalue', d => new Date(d.Seconds*1000))
        .attr('cx', d => xScale(d.Year))
        .attr('cy', d => yScale(new Date(d.Seconds*1000)))
        .attr('r', 5)
        .attr('fill', d => d.Doping == ""? 'rgb(255,153,62)':'rgb(40,124,183)')
        .on('mouseover', d => {
            tooltip.transition()
                    .style('visibility', 'visible')
            d = d.srcElement.__data__
            tooltip.text(
                d.Name+": "+d.Nationality+"\nYear: "+d.Year+" Time: "+d.Time+"\n\n"+d.Doping
            )

            tooltip.attr('data-year', d.Year)
        })
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

    buildScales()

    buildAxes()

    drawCircles()
}