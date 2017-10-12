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


    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    var example1Attributes = function() {
        var attributes = {
            'Gender': ['Man', 'Woman'],
            'Mask': ['Yes', 'No'],
            'Cape': ['Yes', 'No'],
            'Tie': ['Yes', 'No'],
            'Ears': ['Yes', 'No'],
            'Fights': ['Yes', 'No']
        };
        var i = 0;
        for (var attribute in attributes){
            var element = "<div class=\'attribute attribute"+i+"\' id=attribute"+i+" data-name="+attribute+">"+attribute+"</div>";
            $('#problemMetadata').append(element);
            i++;
        }
        return attributes;
    };

    var example1Classes = function() {
        var classes = ['Good', 'Evil'];
        for (var i = classes.length-1; i >=0 ; i--) {
            var aClass = classes[i];
            var element = "<div class=\'class class"+i+"\' id=class"+i+" data-name="+aClass+">"+aClass+"</div>";
            $('#problemMetadata').append(element);
        }
        return classes;
    };

    var example1Dataset = function() {
        var dataset = {};
        dataset['Batman'] = {};
        dataset['Batman']['Gender'] = 'Man';
        dataset['Batman']['Mask'] = 'Yes';
        dataset['Batman']['Cape'] = 'Yes';
        dataset['Batman']['Tie'] = 'No';
        dataset['Batman']['Ears'] = 'Yes';
        dataset['Batman']['Fights'] = 'Yes';
        dataset['Batman']['class'] = 'Good';

        dataset['Robin'] = {};
        dataset['Robin']['Gender'] = 'Man';
        dataset['Robin']['Mask'] = 'Yes';
        dataset['Robin']['Cape'] = 'Yes';
        dataset['Robin']['Tie'] = 'No';
        dataset['Robin']['Ears'] = 'No';
        dataset['Robin']['Fights'] = 'Yes';
        dataset['Robin']['class'] = 'Good';

        dataset['Alfred'] = {};
        dataset['Alfred']['Gender'] = 'Man';
        dataset['Alfred']['Mask'] = 'No';
        dataset['Alfred']['Cape'] = 'No';
        dataset['Alfred']['Tie'] = 'Yes';
        dataset['Alfred']['Ears'] = 'No';
        dataset['Alfred']['Fights'] = 'No';
        dataset['Alfred']['class'] = 'Good';

        dataset['Penguin'] = {};
        dataset['Penguin']['Gender'] = 'Man';
        dataset['Penguin']['Mask'] = 'No';
        dataset['Penguin']['Cape'] = 'No';
        dataset['Penguin']['Tie'] = 'Yes';
        dataset['Penguin']['Ears'] = 'No';
        dataset['Penguin']['Fights'] = 'Yes';
        dataset['Penguin']['class'] = 'Evil';

        dataset['Catwoman'] = {};
        dataset['Catwoman']['Gender'] = 'Woman';
        dataset['Catwoman']['Mask'] = 'Yes';
        dataset['Catwoman']['Cape'] = 'No';
        dataset['Catwoman']['Tie'] = 'No';
        dataset['Catwoman']['Ears'] = 'Yes';
        dataset['Catwoman']['Fights'] = 'No';
        dataset['Catwoman']['class'] = 'Evil';

        dataset['Joker'] = {};
        dataset['Joker']['Gender'] = 'Man';
        dataset['Joker']['Mask'] = 'No';
        dataset['Joker']['Cape'] = 'No';
        dataset['Joker']['Tie'] = 'No';
        dataset['Joker']['Ears'] = 'No';
        dataset['Joker']['Fights'] = 'No';
        dataset['Joker']['class'] = 'Evil';

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

    var initializeExample1 = function() {
        classes = example1Classes();
        attributes = example1Attributes();
        dataset = example1Dataset();
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

    initializeExample1();
    var rootNode = getNewNode();
    var nodeElements = [rootNode];
    var allNodes = [{node: rootNode, attribute: undefined, value: undefined}];
    chart_config = generateConfig();
    var tree = new Treant(chart_config, null, $);
    var selected;

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
                console.log(dataId);
                $('.'+dataId).addClass('highlight');
                $('#'+dataId+" td").addClass('highlight');
            }
        }
    });

    $('#basic-example').on('mouseleave', '.node', function(e) {
        $('.highlight').removeClass('highlight');
    });
});