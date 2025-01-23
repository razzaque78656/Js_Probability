let btn = document.getElementById('btn');
let value = document.getElementById('coinValue');
let result = document.getElementById('result');

btn.addEventListener('click', function() {
    console.log(value.value);
    
    let output = generateOutcomes(value.value);
    console.log(output);
    
    result.innerHTML = ''; // Clear previous results
    output.forEach(element => {
        let span = document.createElement('span');
        span.textContent = element + ' ';
        result.appendChild(span);
    });

    drawTree(value.value); // Generate the tree diagram
});

function generateOutcomes(n) {
    let outcomes = ['']; 

    for (let i = 0; i < n; i++) {
        outcomes = outcomes.flatMap(outcome => [outcome + 'H', outcome + 'T']);
    }

    return outcomes;
}

function drawTree(flips) {
    const svg = d3.select("#treeSvg");
    svg.selectAll("*").remove(); // Clear the previous tree

    // Generate the tree data based on coin flips
    function generateTreeData(flips) {
        function generate(level) {
            if (level >= flips) return [];
            const children = generate(level + 1);
            return [
                { name: "H", children: children.length ? children : [{ name: "H" }, { name: "T" }] },
                { name: "T", children: children.length ? children : [{ name: "H" }, { name: "T" }] },
            ];
        }
        return { name: "Start", children: generate(0) };
    }

    const treeData = generateTreeData(flips);

    // Set up D3 tree layout
    const treeLayout = d3.tree().size([800, 500]); // SVG size
    const root = d3.hierarchy(treeData);
    treeLayout(root);

    // Links (lines between nodes)
    const link = svg
        .selectAll(".link")
        .data(root.links())
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y));

    // Nodes (circles and labels)
    const node = svg
        .selectAll(".node")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    node.append("circle").attr("r", 5);

    node.append("text")
        .attr("dy", -10)
        .attr("x", d => (d.children ? -10 : 10))
        .style("text-anchor", d => (d.children ? "end" : "start"))
        .text(d => d.data.name);
}
