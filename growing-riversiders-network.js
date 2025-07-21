// growing-riversiders-network.js - CSV-Based Network Graph for Growing Riversiders Project
// This script creates an interactive network visualization by loading CSV data from external file

var growingRiversidersNetwork = function() {
    // ============================================================================
    // CANVAS DIMENSIONS
    // ============================================================================
    
    const width = 750;
    const height = 600;

    // ============================================================================
    // CSV DATA LOADING
    // ============================================================================
    
    // Load CSV file and create the graph when loaded
    d3.csv('SourceNodeRelationshipTargetNode.csv').then(function(csvData) {
        console.log('Loaded CSV data:', csvData);
        
        // Process the CSV data
        const relationships = csvData.map(d => ({
            source: d['Source Node'].trim(),
            relationship: d['Relationship'].trim(),
            target: d['Target Node'].trim()
        }));

        // Extract unique nodes and categorize them
        const nodeSet = new Set();
        relationships.forEach(rel => {
            nodeSet.add(rel.source);
            nodeSet.add(rel.target);
        });

        // Create processed data
        const nodes = Array.from(nodeSet).map(name => {
            const category = categorizeNode(name);
            const connections = relationships.filter(r => r.source === name || r.target === name).length;
            
            return {
                id: name,
                name: name,
                ...category,
                connections: connections,
                size: category.size + (connections * 2)
            };
        });

        const links = relationships.map(rel => ({
            source: rel.source,
            target: rel.target,
            relationship: rel.relationship,
            strength: 1,
            type: getRelationshipType(rel.relationship)
        }));

        createGraph(nodes, links);
        
    }).catch(function(error) {
        console.error('Error loading CSV file:', error);
        
        // Create fallback graph with error message
        const fallbackNodes = [
            { 
                id: 'CSV Load Error', 
                name: 'Please ensure SourceNodeRelationshipTargetNode.csv is in the same folder', 
                type: 'error', 
                color: '#ff4757', 
                size: 30, 
                connections: 0 
            }
        ];
        const fallbackLinks = [];
        createGraph(fallbackNodes, fallbackLinks);
    });

    // ============================================================================
    // NODE CATEGORIZATION FUNCTION
    // ============================================================================
    
    function categorizeNode(nodeName) {
        const name = nodeName.toLowerCase();
        
        if (name.includes('haque tan studio') || name.includes('plant parents') || name.includes('community champions')) {
            return { type: 'organization', color: '#ff6b6b', size: 25 };
        } else if (name.includes('usman haque') || name.includes('ling tan')) {
            return { type: 'person', color: '#4ecdc4', size: 20 };
        } else if (name.includes('project') || name.includes('platform')) {
            return { type: 'project', color: '#45b7d1', size: 30 };
        } else if (name.includes('plants') || name.includes('wilds ecology centre') || name.includes('mosaic')) {
            return { type: 'physical', color: '#96ceb4', size: 22 };
        } else if (name.includes('documentation') || name.includes('archive') || name.includes('artifact')) {
            return { type: 'documentation', color: '#feca57', size: 20 };
        } else if (name.includes('experts') || name.includes('audience')) {
            return { type: 'community', color: '#ff9ff3', size: 18 };
        } else if (name.includes('centre') || name.includes('venue')) {
            return { type: 'venue', color: '#54a0ff', size: 20 };
        } else {
            return { type: 'artifact', color: '#5f27cd', size: 16 };
        }
    }

    function getRelationshipType(relationship) {
        const rel = relationship.toLowerCase();
        if (rel.includes('organizes') || rel.includes('led by')) return 'leadership';
        if (rel.includes('partners') || rel.includes('coordinates')) return 'collaboration';
        if (rel.includes('use') || rel.includes('connects')) return 'interaction';
        if (rel.includes('documents') || rel.includes('contains')) return 'documentation';
        if (rel.includes('nurture') || rel.includes('assembled')) return 'creation';
        return 'general';
    }

    // ============================================================================
    // GRAPH CREATION FUNCTION
    // ============================================================================
    
    function createGraph(nodes, links) {
        // Clear any existing content
        d3.select('#d3-container-3 svg').remove();
        
        // ============================================================================
        // SVG SETUP WITH ZOOM BEHAVIOR
        // ============================================================================
        
        const svg = d3.select('#d3-container-3')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', '#ffffff');

        const g = svg.append('g');

        // Add arrow markers for directed edges
        const defs = g.append('defs');
        
        const relationshipColors = {
            'leadership': '#ff6b6b',
            'collaboration': '#4ecdc4', 
            'interaction': '#45b7d1',
            'documentation': '#feca57',
            'creation': '#96ceb4',
            'general': '#888'
        };

        Object.entries(relationshipColors).forEach(([type, color]) => {
            defs.append('marker')
                .attr('id', `arrowhead-${type}`)
                .attr('viewBox', '-0 -5 10 10')
                .attr('refX', 25)
                .attr('refY', 0)
                .attr('orient', 'auto')
                .attr('markerWidth', 4)
                .attr('markerHeight', 4)
                .append('path')
                .attr('d', 'M 0,-4 L 8,0 L 0,4')
                .attr('fill', color);
        });

        // ============================================================================
        // ZOOM BEHAVIOR SETUP
        // ============================================================================
        
        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        svg.call(zoom);

        // ============================================================================
        // FORCE SIMULATION
        // ============================================================================
        
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links)
                .id(d => d.id)
                .distance(d => {
                    switch(d.type) {
                        case 'leadership': return 80;
                        case 'collaboration': return 100;
                        case 'interaction': return 120;
                        case 'documentation': return 90;
                        case 'creation': return 110;
                        default: return 100;
                    }
                })
                .strength(0.7))
            .force('charge', d3.forceManyBody()
                .strength(d => {
                    if (d.connections > 5) return -1000;
                    if (d.connections > 3) return -600;
                    return -400;
                }))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide()
                .radius(d => d.size + 15));

        // ============================================================================
        // LINK VISUALIZATION
        // ============================================================================
        
        const link = g.append('g')
            .attr('stroke-opacity', 0.6)
            .selectAll('line')
            .data(links)
            .enter().append('line')
            .attr('stroke', d => relationshipColors[d.type] || '#888')
            .attr('stroke-width', d => Math.max(1, d.strength * 2))
            .attr('marker-end', d => `url(#arrowhead-${d.type})`);

        // Link labels
        const linkLabel = g.append('g')
            .selectAll('text')
            .data(links)
            .enter().append('text')
            .attr('font-size', 9)
            .attr('fill', '#666')
            .attr('text-anchor', 'middle')
            .attr('pointer-events', 'none')
            .attr('font-family', 'monospace')
            .text(d => d.relationship.length > 15 ? d.relationship.substring(0, 15) + '...' : d.relationship);

        // ============================================================================
        // NODE VISUALIZATION
        // ============================================================================
        
        const node = g.append('g')
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .selectAll('circle')
            .data(nodes)
            .enter().append('circle')
            .attr('r', d => d.size)
            .attr('fill', d => d.color)
            .style('filter', 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5))')
            .call(drag(simulation));

        // Node labels
        const nodeLabel = g.append('g')
            .selectAll('text')
            .data(nodes)
            .enter().append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .attr('font-size', 10)
            .attr('font-family', 'monospace')
            .attr('fill', '#333')
            .attr('font-weight', 'bold')
            .attr('text-shadow', '1px 1px 1px rgba(255, 255, 255, 0.8)')
            .attr('pointer-events', 'none')
            .text(d => {
                if (d.name.length > 12) {
                    return d.name.substring(0, 12) + '...';
                }
                return d.name;
            });

        // ============================================================================
        // TOOLTIP FUNCTIONALITY
        // ============================================================================
        
        // Create tooltip with inline styles to avoid CSS conflicts
        const tooltip = d3.select('body').append('div')
            .style('position', 'absolute')
            .style('background', 'rgba(255, 255, 255, 0.95)')
            .style('color', '#333')
            .style('padding', '12px')
            .style('border-radius', '6px')
            .style('font-size', '12px')
            .style('font-family', 'monospace')
            .style('pointer-events', 'none')
            .style('border', '1px solid #ccc')
            .style('box-shadow', '0 2px 8px rgba(0,0,0,0.1)')
            .style('max-width', '300px')
            .style('z-index', '1001')
            .style('opacity', 0);

        // Mouse event handlers
        node.on('mouseover', function(event, d) {
            const connectedNodes = new Set([d.id]);
            
            link.style('stroke-opacity', l => {
                if (l.source.id === d.id || l.target.id === d.id) {
                    connectedNodes.add(l.source.id);
                    connectedNodes.add(l.target.id);
                    return 1;
                }
                return 0.1;
            });

            node.style('opacity', n => connectedNodes.has(n.id) ? 1 : 0.3);
            nodeLabel.style('opacity', n => connectedNodes.has(n.id) ? 1 : 0.3);
            linkLabel.style('opacity', l => (l.source.id === d.id || l.target.id === d.id) ? 0.9 : 0.3);

            showTooltip(event, d);
        })
        .on('mouseout', function(event, d) {
            link.style('stroke-opacity', 0.6);
            node.style('opacity', 1);
            nodeLabel.style('opacity', 1);
            linkLabel.style('opacity', 0.8);
            
            hideTooltip();
        })
        .on('click', function(event, d) {
            console.log('Clicked on:', d.name, 'Type:', d.type, 'Connections:', d.connections);
            showDetailedTooltip(event, d);
        });

        function showTooltip(event, d) {
            tooltip.transition()
                .duration(200)
                .style('opacity', 1);
            
            tooltip.html(`
                <strong>${d.name}</strong><br/>
                Type: ${d.type}<br/>
                Connections: ${d.connections}<br/>
                <em>Click for details</em>
            `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');
        }

        function showDetailedTooltip(event, d) {
            const relatedLinks = links.filter(l => l.source.id === d.id || l.target.id === d.id);
            
            let details = `<strong>${d.name}</strong><br/><br/>`;
            details += `<strong>Relationships:</strong><br/>`;
            
            relatedLinks.forEach(link => {
                if (link.source.id === d.id) {
                    details += `→ ${link.relationship} → ${link.target.id}<br/>`;
                } else {
                    details += `← ${link.source.id} ← ${link.relationship}<br/>`;
                }
            });
            
            tooltip.html(details)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px')
                .style('opacity', 1);
        }

        function hideTooltip() {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        }

        // ============================================================================
        // ANIMATION LOOP
        // ============================================================================
        
        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            linkLabel
                .attr('x', d => (d.source.x + d.target.x) / 2)
                .attr('y', d => (d.source.y + d.target.y) / 2);

            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);

            nodeLabel
                .attr('x', d => d.x)
                .attr('y', d => d.y);
        });

        // ============================================================================
        // DRAG BEHAVIOR
        // ============================================================================
        
        function drag(simulation) {
            function dragstarted(event, d) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(event, d) {
                d.fx = event.x;
                d.fy = event.y;
            }

            function dragended(event, d) {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }

            return d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended);
        }

        // ============================================================================
        // GLOBAL CONTROL FUNCTIONS (called from HTML buttons)
        // ============================================================================
        
        window.resetZoom = function() {
            svg.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity
            );
        };

        window.centerGraph = function() {
            const bounds = g.node().getBBox();
            const fullWidth = bounds.width;
            const fullHeight = bounds.height;
            const midX = bounds.x + fullWidth / 2;
            const midY = bounds.y + fullHeight / 2;
            
            const scale = Math.min(width / fullWidth, height / fullHeight) * 0.8;
            const translate = [width / 2 - scale * midX, height / 2 - scale * midY];
            
            svg.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
            );
        };

        let labelsVisible = true;
        window.toggleLabels = function() {
            labelsVisible = !labelsVisible;
            nodeLabel.style('opacity', labelsVisible ? 1 : 0);
            linkLabel.style('opacity', labelsVisible ? 0.8 : 0);
        };

        let animationRunning = true;
        window.toggleAnimation = function() {
            if (animationRunning) {
                simulation.stop();
            } else {
                simulation.restart();
            }
            animationRunning = !animationRunning;
        };

        // Auto-center the graph after initial layout
        setTimeout(() => {
            window.centerGraph();
        }, 2000);
    }
};

// Execute the network visualization
growingRiversidersNetwork();