document.addEventListener("DOMContentLoaded", function () {
  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
  )
    .then((res) => res.json())
    .then((data) => {
      const dataset = data.monthlyVariance;
      console.log(dataset);
      const w = 1200;
      const h = 600;
      const p = 65;
      const legendWidth = 200;
      const legendHeight = 100;

      const svg = d3.select("#chart").attr("width", w).attr("height", h);
      d3.select('#title').text('Monthly Global Land-Surface Temperature')
      d3.select('#description').text('1753 - 2015: base temperature 8.66℃')

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const xScale = d3
        .scaleTime()
        .domain([1753, 2015])
        .range([p, w - p]);

      const yScale = d3
        .scaleBand()
        .domain(monthNames)
        .range([h - 100 - p, p]);

      const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
      const yAxis = d3.axisLeft(yScale).tickFormat((d, i) => monthNames[i]);

      svg
        .append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${h - 100 - p})`)
        .call(xAxis);

      svg
        .append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${p}, 0)`)
        .call(yAxis);

      svg
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("x", (d) => xScale(d.year))
        .attr("y", (d) => yScale(monthNames[d.month - 1]))
        .attr("width", 3.5)
        .attr("height", 30)
        .attr("fill", (d) => changeColor(d.variance + 8.66))
        .attr("data-year", (d) => d.year)
        .attr("data-month", (d) => d.month - 1)
        .attr("data-temp", (d) => d.variance)
        .on("mouseover", (e, d) => {
          const tooltip = document.getElementById("tooltip");
          tooltip.style.display = "block";
          tooltip.style.left = e.pageX - 20 + "px";
          tooltip.style.top = e.pageY - 40 + "px";
          tooltip.setAttribute("data-year", d.year);
          tooltip.innerHTML = `
          ${d.year} <br>`;
        })
        .on("mouseout", () => {
          document.getElementById("tooltip").style.display = "none";
        });

      function changeColor(num) {
        console.log(num);
        if (num >= 2.8 && num < 3.9) {
          return "blue";
        } else if (num >= 3.9 && num < 5.0) {
          return "red";
        } else if (num >= 5.0 && num < 6.1) {
          return "green";
        } else if (num >= 6.1 && num < 7.2) {
          return "gray";
        } else if (num >= 7.2 && num < 8.3) {
          return "yellow";
        } else if (num >= 8.3 && num < 9.5) {
          return "orange";
        } else if (num >= 9.5 && num < 10.5) {
          return "purple";
        } else if (num >= 10.5 && num < 11.7) {
          return "navy";
        } else if (num >= 11.7 && num <= 12.8) {
          return "violet";
        } else {
          return "gray";
        }
      }

      const colorRanges = [
        { min: 2.8, max: 3.9, color: "blue" },
        { min: 3.9, max: 5.0, color: "red" },
        { min: 5.0, max: 6.1, color: "green" },
        { min: 6.1, max: 7.2, color: 'gray'},
        { min: 7.2, max: 8.3, color: 'yellow'},
        { min: 8.3, max: 9.5, color: 'orange'},
        { min: 9.5, max: 10.5, color: 'purple'},
        { min: 10.5, max: 11.7, color: 'navy'},
        { min: 11.7, max: 12.8, color: 'violet'},
      ];

      const legend = svg.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${p},${h - legendHeight})`);

      colorRanges.forEach((range, index) => {
        legend.append("rect")
          .attr("x", index * 100)
          .attr("y", 0)
          .attr("width", 20)
          .attr("height", 20)
          .attr("fill", range.color);

        legend.append("text")
          .attr("x", index * 100 + 23)
          .attr("y", 16)
          .text(`${range.min} - ${range.max}`);
      });

    })
    .catch((err) => console.error("Error al cargar los datos:", err));
});
