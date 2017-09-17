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
            var element = "<div class=\'class class"+i+"\' id=class"+i+"data-name="+aClass+">"+aClass+"</div>";
            $('#problemMetadata').append(element);
        }
        return classes;
    };

    var getNewNode = function(parent, text, aClass){
        if(text === undefined) text = "Select attribute here";
        if(aClass === undefined) aClass = "undecided";
        if (parent === undefined)
            return {
                text: {
                    name: text
                },
                HTMLclass: aClass,
                HTMLid: ''+lastNodeIndex,

            };
        else 
            return {
                text: {
                    name: text,
                },
                HTMLclass: aClass,
                HTMLid: ''+lastNodeIndex,
                parent: parent
            };
    }


    var generateConfig = function(){
        var treeConfig = [config];
        for (var nodeIndex in allNodes){
            treeConfig.push(allNodes[nodeIndex]['node']);
        }
        return treeConfig;
    }

    var rootNode = getNewNode();
    var allNodes = {
        0: {
            node: rootNode,
            nodeName: 'rootNode',
            children: [],
            type: 'none',
            value: 'none',
            parent: 'none'
            }
    };

    chart_config = generateConfig();

    console.log(chart_config);
    var tree = new Treant(chart_config, null, $);

    var attributes = example1Attributes();
    var classes = example1Classes();
    var selected;

    $('.undecided').on('click', function(e){
        /*
        console.log('click');
        var id = $(this).attr('id');
        var node = allNodes[id];
        */
        if(selected){
            selected.removeClass('selected');
        }
        selected = $(this);
        $(this).addClass('selected');
    });

    $('.attribute,.class').on('click', function(e){
        if(!selected){
            return;
        }
        var id = selected.attr('id');
        selected.removeClass('selected');
        selected.removeClass('undecided');
        var attribute = $(this).attr('id');
        selected.addClass(attribute);
        //var selectedNodeName = allNodes[id]['nodeName'];
        var selectedNodeObject = allNodes[id];
        selectedNodeObject['node']['HTMLclass'] = attribute;
        selectedNodeObject['node']['text']['name'] = $(this).attr('data-name');
        //console.log(selectedNodeName);

        //var attributeIndex = $(this).attr('data-index');
        var attributeName = $(this).attr('data-name');

        //console.log(attributes[attributeName]);

        for(var valueIndex in attributes[attributeName]) {
            var value = attributes[attributeName][valueIndex];
            lastNodeIndex++;
            var newNode = getNewNode(selectedNodeObject);
            allNodes[lastNodeIndex] = {
                node: newNode
            };
        }
        var new_config = generateConfig();
        //console.log(allNodes);
        console.log(new_config);
        //console.log(tree);
        tree.destroy();
        window.setTimeout(function() {
            console.log('timeout');
            tree = new Treant(new_config);
            console.log(tree);
        }, 1);

    });
});