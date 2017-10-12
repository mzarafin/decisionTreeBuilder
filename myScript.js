$(document).ready(function(){
    var config = {
        container: "#basic-example",       
        connectors: {
            type: 'step'
        },
        node: {
            HTMLclass: 'nodeExample1'
        }
    };
    var lastNodeIndex = 0;
    var attributes; 
    var classes;
    var dataset;
    var rootNode;
    var nodeElements = [];
    var allNodes = [];
    var tree;
    var selected;
    var chart_config;


    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    function readTextFile(file, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
    }

    var initializeAttributes = function() {
        var i = 0;
        for (var attribute in attributes){
            var element = "<div class=\'attribute attribute"+i+"\' id=attribute"+i+" data-name="+attribute+">"+attribute+"</div>";
            $('#problemMetadata').append(element);
            i++;
        }
        return attributes;
    };

    var initializeClasses = function() {
        for (var i = classes.length-1; i >=0 ; i--) {
            var aClass = classes[i];
            var element = "<div class=\'class class"+i+"\' id=class"+i+" data-name="+aClass+">"+aClass+"</div>";
            $('#problemMetadata').append(element);
        }
        return classes;
    };

    var initializeDataset = function() {
        $('#dataset').append("<tr>");
        $('#dataset').append("<th>ID</th>");
        for (var attribute in attributes){
            $('#dataset').append("<th>"+attribute+"</th>");
        }        
        $('#dataset').append("<th>Class</th>");
        $('#dataset').append("</tr>");

        for (var name in dataset) {
            var instance = dataset[name];
            $('#dataset').append("<tr>");
            var instanceNameElement = "<td class=\'"+name+"\' id=instance"+name+" data-name=instance"+name+">"+name+"</td>";
            $('#dataset').append(instanceNameElement);

            for (var attributeName in instance) {
                var attributeValue = instance[attributeName];
                var attributeValueElement =  "<td class=\'attributeValue "+name+"\'>" + attributeValue + "</td>";
                $('#dataset').append(attributeValueElement);
            }

            $('#dataset').append("</tr>");
        }


        return dataset;
    }

    var initializeSuperheroes = function() {
        classes = superheroesClasses;
        attributes = superheroesAttributes;
        dataset = superheroesDataset;
        initializeClasses();
        initializeAttributes();
        initializeDataset();        
        initializeTree();
        initializeEvents();
    }

    var initializeFromaloons = function() {
        classes = fromaloonsClasses;
        attributes = fromaloonsAttributes;
        dataset = fromaloonsDataset;
        initializeClasses();
        initializeAttributes();
        initializeDataset();        
        initializeTree();
        initializeEvents();
    }

    var initializeDebt = function() {
        classes = debtClasses;
        attributes = debtAttributes;
        dataset = debtDataset;
        initializeClasses();
        initializeAttributes();
        initializeDataset();        
        initializeTree();
        initializeEvents();
    }
    var initializeTree = function () {
        rootNode = getNewNode();
        nodeElements = [rootNode];
        allNodes = [{node: rootNode, attribute: undefined, value: undefined}];
        chart_config = generateConfig();
        tree = new Treant(chart_config, null, $);
    }

    var initializeEvents = function() {
                $('#basic-example').on('click', '.undecided', function(e){
            if(selected){
                selected.removeClass('selected');
            }
            selected = $(this);
            $(this).addClass('selected');
        });

        $('.attribute').on('click', function(e){
            if(!selected){
                return;
            }
            var id = selected.attr('id');
            selected.removeClass('selected');
            selected.removeClass('undecided');
            var attribute = $(this).attr('id');
            selected.addClass(attribute);
            var selectedNodeObject = nodeElements[id];
            selectedNodeObject['HTMLclass'] = attribute;
            var className = $(this).attr('data-name');
            if (selectedNodeObject['text']['title']){
                selectedNodeObject['text']['title'] = className;
            } else {
                selectedNodeObject['text']['name'] = className;
            }
            var attributeName = $(this).attr('data-name');

            for(var valueIndex in attributes[attributeName]) {
                var value = attributes[attributeName][valueIndex];
                lastNodeIndex++;
                var newNode = getNewNode(selectedNodeObject, undefined, 'undecided', attributeName, value);
                allNodes[lastNodeIndex] = {
                    attribute: attributeName,
                    value: value,
                    node: newNode,
                    parent: allNodes[id],
                };
                nodeElements[lastNodeIndex] = newNode;
            }
            var new_config = generateConfig();
            tree.destroy();
            tree = new Treant(new_config);
            selected = undefined;
        });

        $('.class').on('click', function(e){
            if(!selected){
                return;
            }
            var id = selected.attr('id');
            selected.removeClass('selected');
            selected.removeClass('undecided');
            var attribute = $(this).attr('id');
            selected.addClass(attribute);
            var selectedNodeObject = nodeElements[id];
            selectedNodeObject['HTMLclass'] = attribute;
            var className = $(this).attr('data-name');
            if (selectedNodeObject['text']['title']){
                selectedNodeObject['text']['title'] = className;
            } else {
                selectedNodeObject['text']['name'] = className;
            }
            var new_config = generateConfig();
            tree.destroy();
            tree = new Treant(new_config);
            selected = undefined;
        });

        $('#basic-example').on('mouseover', '.node', function(e) {
            var elementHovered = $(this).attr('id');
            var elementNode = nodeElements[elementHovered];
            var node = allNodes[elementHovered];

            var restrictions = {};
            while(node.attribute){
                restrictions[ node.attribute ] = node.value;
                node = node.parent;
            }
            for(var dataId in dataset){
                var meetsCriteria = true;
                for(var attribute in restrictions){
                    if(dataset[dataId][attribute] != restrictions[attribute]){
                        meetsCriteria = false;
                        break;
                    }
                }

                if(meetsCriteria){
                    $('.'+dataId).addClass('highlight');
                    $('#'+dataId+" td").addClass('highlight');
                }
            }
        });

        $('#basic-example').on('mouseleave', '.node', function(e) {
            $('.highlight').removeClass('highlight');
        });
    }

    var getNewNode = function(parent, text, aClass, attribute, value){
        if(text === undefined) text = "Select attribute here";
        if(aClass === undefined) aClass = "undecided";
        if (parent === undefined) {
            return {
                text: {
                    name: text
                },
                HTMLclass: aClass,
                HTMLid: ''+lastNodeIndex,
                _json_data_attribute: attribute,
                _json_data_value: value,
                _json_id: lastNodeIndex
            };
        }
        else {
            return {
                text:{
                    name: attribute+"="+value,
                    title: text,
                },
                HTMLclass: aClass,
                HTMLid: ''+lastNodeIndex,
                parent: parent,
                _json_data_attribute: attribute,
                _json_data_value: value,
                _json_id: lastNodeIndex
            };
        }
    }


    var generateConfig = function() {
        var treeConfig = [config];
        for (var nodeIndex in nodeElements){
            var node = nodeElements[nodeIndex];
            var children = node["children"];
            for (var childIdx in children) {
                var child = children[childIdx];
                nodeElements[child["HTMLid"]]["parent"] = node;
            }
            delete node["children"];
            treeConfig.push(node);
        }
        return treeConfig;
    }

    $('#superheroes').on('click', function(e){
        $('#examples').hide();
        initializeSuperheroes();
    });

    $('#fromaloons').on('click', function(e){
        $('#examples').hide();
        initializeFromaloons();
    });

    $('#debt').on('click', function(e){
        $('#examples').hide();
        initializeDebt();
    });



    //initializeSuperheroes();

});