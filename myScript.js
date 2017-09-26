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
            var element = "<div class=\'class class"+i+"\' id=class"+i+"data-name="+aClass+">"+aClass+"</div>";
            $('#problemMetadata').append(element);
        }
        return classes;
    };

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
                _json_id: lastNodeIndex
            };
        }
    }


    var generateConfig = function() {
        var treeConfig = [config];
        for (var nodeIndex in allNodes){
            var node = allNodes[nodeIndex];
            var children = node["children"];
            for (var childIdx in children) {
                var child = children[childIdx];
                allNodes[child["HTMLid"]]["parent"] = node;
            }
            delete node["children"];
            treeConfig.push(node);
        }
        return treeConfig;
    }

    var rootNode = getNewNode();
    var allNodes = [rootNode];
    chart_config = generateConfig();
    var tree = new Treant(chart_config, null, $);
    var attributes = example1Attributes();
    var classes = example1Classes();
    var selected;

    $('#basic-example').on('click', '.undecided', function(e){
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
        var selectedNodeObject = allNodes[id];
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
            //    var getNewNode = function(parent, text, aClass, attribute, value){
            var newNode = getNewNode(selectedNodeObject, undefined, 'undecided', attributeName, value);
            allNodes[lastNodeIndex] = newNode;
            //Tree.prototype.addNode(selectedNodeObject, newNode);
        }
        console.log('before generate config');
        console.log(JSON.stringify(allNodes));
        var new_config = generateConfig();
        console.log('before destroy');
        console.log(JSON.stringify(new_config));
        tree.destroy();
        //window.setTimeout(function() {
        tree = new Treant(new_config);
        //}, 1);
        console.log('after all');
        console.log(tree);

    });
});