/**
de quoi tester et construire les films/sequences/plans des programmes
**/
import {xsend} from './xsend.js'
export {
    isSujet,
    getSujet,
    graphSujet,
    graphSujets,
}

var isSujet = function (user, nom, elt, reperes) {
    //    vrai si l'élément elt a le même sujet (nom) que le film
    // reperes est un tableau d'élélément EPS {evenement,type,detail}
    // ne contenant que les événements clés (NEW, LOAD, SAVE)
    if (elt.detail == nom) return true
    let lastSave = reperes.find(d => d.evenement.user == user && d.type == "SAVE" && d.detail == elt.detail)
    if (lastSave == undefined) return false
    let index = reperes.indexOf(lastSave)
    if (index <= 0) return false
    return isSujet(user, nom, reperes[index - 1], reperes)
}

var getSujet = function (user, elt, reperes) {
    //trouve, si possible, le sujet du film dont fait partie l'élément elt
    // reperes est un tableau d'élélément EPS {evenement,type,detail}
    // ne contenant que les événements clés (NEW, LOAD, SAVE)
    if (elt.evenement.type != "EPR" || !(elt.type=="LOAD" || elt.type=="SAVE") ) return elt.evenement.type
    if (elt.detail) {
        if (isNaN(elt.detail)) return elt.detail
        let lastSave = reperes.find(d => d.evenement.user == user && d.type == "SAVE" && d.detail == elt.detail)
        if (lastSave == undefined) {
            return undefined
        }
        let index = reperes.indexOf(lastSave)
        if (index <= 0) return undefined
        return getSujet(user, reperes[index - 1], reperes)
    }
    //on arrive à une création, on donne comme nom l'id de l'evenement
    return "NEW-" + elt.evenement.id
}

function formatSecondsToHMS(num) {
    var h = Math.floor(num / 3600);
    var m = Math.floor((num - h * 3600) / 60);
    var s = num - (h * 3600 + m * 60);
    return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
}

var graphSujets=function(config) {
    //construit les graphSujet
    //on cré ou vide le div contenant
    var div
    if (config.element.select("#graphSujet").empty()) {
        div=config.element.append("div").attr("id","graphSujet").attr("style","white-space:normal")
    } else {
        div=config.element.select("#graphSujet")
        div.selectAll("*").remove()
    }
    let users=d3.map(config.result,d=>d.evenement.user).keys()    
    users.forEach(function(u){graphSujet({
                                user:u,
                                reperes:config.result,
                                callback:config.statsGraphSession,
                                div:div,
                                width:250
                                })
    })
    
}

var graphSujet = function (config){
    
    // construit l'évolution du sujet sur les sessions données
    //  reperes est un tableau d'élélément EPS {evenement,type,detail}
    // ne contenant que les événements clés (NEW, LOAD, SAVE)
    var user=config.user,
        reperes=config.reperes,
        callback=config.callback || function(d){console.log("callback graphsujet",d)},        
        div=config.div
     
    const nodes = reperes.filter(d => d.evenement.user == user)
    const session_keys=d3.map(nodes,d=>d.evenement.session_key).keys() //sessions concernant cet élève
    
    let links = []
    const width = config.width || 150,
        height = config.height || 150;
    const dy=(height-15)/(nodes.length-1)
    
    let dtime=null
    //construction des liens
    nodes.forEach(function (node, index) {
        if (index==0) {
            dtime=node.evenement.time   
            node.dtime=0
            
        }
        node.elapsedTime=Math.round((node.evenement.time-dtime)/1000)
        //console.log(index,node.elapsedTime)
        node.id = node.evenement.id
        //node.fy=index*dy-height/2+10
        node.y=index*dy-height/2+10
        node.x=0
        if (index > 0) {
            let prev=nodes[index - 1]
            node.dtime=node.elapsedTime-prev.elapsedTime
            links.push({
                source: prev,
                target: node,
                type: "next"
            })
        }
        if (node.type == "SAVE") {
            node.sujet = getSujet(user, node, nodes)
            links.push({
                source: nodes[index - 1],
                target: node,
                type: node.type
            })
        } else if (node.type == "LOAD") {
            if (isNaN(node.detail)) {
                //c'est un programme de base, on recherche le dernier LOAD
                node.sujet = node.detail; //getSujet(user,node,nodes)
                let lastLoad = undefined
                /*                 
                 for (var i=index;i-->0;) {
                    if (nodes[i].type=="LOAD" && nodes[i].detail==node.sujet) {
                        console.log(node.evenement.user_nom,"LOAD depuis",i,"vers",index)
                        lastLoad=nodes[i]; break;
                    }
                }*/
                lastLoad = nodes.find(d => d.type == "LOAD" && d.detail == node.sujet)
                if (lastLoad != undefined) {
                    links.push({
                        source: lastLoad,
                        target: node,
                        type: node.type + "_BASE"
                    })
                }
            } else {
                //c'est un programme préalablement sauvé
                node.sujet = getSujet(user, node, nodes)
                let lastSave = nodes.find(d => d.evenement.user == user && d.type == "SAVE" && d.detail == node.detail)
                if (lastSave != undefined) {
                    links.push({
                        source: lastSave,
                        target: node,
                        type: node.type + "_SAVED"
                    })
                }
            } 
        } else {
            //c'est un autre type devenement(lance ou fin de session)
            node.sujet=getSujet(user, node, nodes)
        }
    })
    //on ajoute le temps
    links.forEach(function (l) {
        l.temps = Math.round((new Date(l.target.evenement.time) - new Date(l.source.evenement.time)) / 1000)        
    })
    //console.log("user", user, nodes, links, reperes)
    //console.log("d3",d3el)
    let chart = function () {
        //const links = data.links.map(d => Object.create(d));
        //const nodes = data.nodes.map(d => Object.create(d));
        const color = d3.scaleOrdinal(d3.schemeCategory10).domain(["NEW", "LOAD", "SAVE", "next"])
        const simulation = forceSimulation(nodes, links).on("tick", ticked);
        // const svg = d3.select(DOM.svg(width, height))

        let svg2 = div.append('svg')
            .attr("id", user)
            .attr("width", width).attr("height", height)
            .attr("viewBox", [-width / 2, -height / 2, width, height]);
        var borderPath = svg2.append("rect")
            .attr("x", -width / 2)
            .attr("y", -height / 2)
            .attr("height", height)
            .attr("width", width)
            .style("stroke", "black")
            .style("fill", "none")
            .style("stroke-width", 1);
        svg2.append("text").text(nodes[0].evenement.user_nom)

        // Define Zoom Function Event Listener
        function zoomFunction() {
            //console.log("zoom", d3.zoomTransform(this), svg2.select("g.mapsvg"))
            var transform = d3.zoomTransform(this);
            svg2.select("g.mapsvg")
                //.attr("transform", "translate(" +( transform.x) + "," + (transform.y) + ") scale(" + transform.k + ")");
                .attr("transform", "scale(" + transform.k + ")");
        }

        // Define Zoom Behavior
        var zoom = d3.zoom()
            .scaleExtent([0.2, 10])
            .on("zoom", zoomFunction);

        let svg = svg2.append("g").attr("class", "mapsvg").call(zoom)
        var rect = svg.append("rect")
            .datum({sessions:session_keys,user:nodes[0].evenement.user_nom,creation:nodes[0].evenement.creation})
            .attr("x", -width / 2)
            .attr("y", -height / 2)
            .attr("height", height)
            .attr("width", width)
            .style("fill", "none")
            .style("pointer-events", "all")
        rect.on("click",callback)
            /*
        rect.on("click", function (d, i) {
            console.log("cliock", svg2.attr("id"),d)
            const o=d3.select("#overlayDiv")
            console.log("s",o.style("hidden"))            
            xsend("/boucles/sessions/donnees/", csrf_token, {
                "type": "ii",
                "data": d
            }, "POST")
                .then(function(response) {console.log("recu:",response)})           
            
            o.style("visibility",z=>o.style("visibility")=="hidden"?"visible":"hidden")
            
        })*/
        //.style("opacity",0.1);
        const link = svg.append("g")

            .selectAll("line")
            .data(links)
            .enter().append("line")
            //.attr("stroke", d=>color(d.type))
            .attr("stroke", d => d.type == "LOAD_BASE" ? color("LOAD") :
                d.type == "LOAD_SAVED" ? color("SAVE") :
                color(d.type))
            .attr("stroke-opacity", d => d.type == "next" ? 0.4 : 0.8)
        link.append("title").text(d => d.source.id + ">" + d.target.id + "\n" +
            "(" + formatSecondsToHMS(d.temps) + ")")

        //.attr("stroke-width", d => Math.sqrt(d.value));

        const node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("class","node")
            .attr("r", 5)
            .attr("fill", d => color(d.type))
          const state = {
       isFetching: false,
       canFetch: true
        }   
        tippy(".node",{placement:"top",size:'tiny',interactive:true,
        //trigger:"click",
        distance:5,
        delay:[100,100],
        animation:'fade',
        content: function(d){
            //console.log("toolt",d)
            let data=d.__data__
            return "<strong>[ "+nodes.indexOf(data)+" ]</strong>"
                    +(data.snapshot?"<p class=hasimage>"
                                    +data.snapshot.image.substring(
                                            data.snapshot.image.lastIndexOf('_')+1)
                                    +"</p>":"")
                    +"<p>"+data.type+" <i>"+(data.detail?data.detail:"")+"<i></p>"
                    +"<p><strong>"+data.sujet+"</strong> id "+data.id+"</p>"
                    +"<p>"+formatSecondsToHMS(data.elapsedTime)+"</p>"
                    +"<p>+"+formatSecondsToHMS(data.dtime)+"</p>"
            },
            onShown(tip) {
                
                let s=tippy('.hasimage',{
                        theme:'light',                 
                        placement:'right',
                        delay:200,
                        arrow:true,
                        arrowType: 'round',
                        size: 'large',
                        duration: 500,
                        animation: 'perspective',
                        async onShow(ttip) {                     
                            if ( state.isFetching || !state.canFetch) return
                            state.isFetching = true
                            state.canFetch = false
                            //console.log("tip",tip,tip.reference)
                            try {
                              var image=tip.reference.__data__.snapshot.image
                              const response = await fetch(image)
                              const blob = await response.blob()
                              const url = URL.createObjectURL(blob)
                              if (ttip.state.isVisible) {
                                const img = new Image()
                                img.width = 300
                                img.height = 300
                                img.src = url
                                ttip.setContent(img)
                              }
                            } catch (e) {
                              ttip.setContent(`Fetch failed. ${e}`)
                            } finally {
                              state.isFetching = false
                            }
                          },
                          onHidden(ttip) {
                            state.canFetch = true
                            //ttip.setContent("juste une image")
                          }
                          
                        })
            }, 
        })
            /*
        node.append("title")
            .text(d => "[ " + nodes.indexOf(d) + " ]\n" +
                d.type + " " +
                (d.detail ? d.detail : "") +
                "\n" + d.sujet + "\nid " + d.id);
*/
        function ticked() {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
            /* node.select("text")
                 .attr("x", d => d.x)
                 .attr("y", d => d.y);*/
            //svg.select("rect").call(d3.zoom().on("zoom",function(){svg.attr("transform", d3.event.transform)}))
        }

        return svg.node();
    }

    function forceSimulation(nodes, links) {
        console.log("nodes",nodes,links,d3.max(links,d=>d.temps))
        const dtmax=d3.max(links,d=>d.temps)
        return d3.forceSimulation(nodes)
            .force("y", d3.forceY().y(d => nodes.indexOf(d)*dy-height/2+10).strength(0.9))
            //.force("x", d3.forceX().strength(d => d.type == "NEW" || (d.type == "LOAD" && d.detail == undefined) ? 0.5 : 0.1))
            .force("link", d3.forceLink(links)
                    .id(d => d.id)
                    .distance(d=>d.type=="next"?dy+(width-10)*d.temps/(2*dtmax):dy)
                    .strength(d=>d.type=="next"?0.9:0.0))
            //.force("charge", d3.forceManyBody())
            //.force("center", d3.forceCenter())
            .force("collide", d3.forceCollide(10));
    }

    let svg = chart();


}
