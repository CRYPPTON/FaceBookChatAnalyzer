
const encode_utf8 = (s) => unescape(encodeURIComponent(s));
const decode_utf8 = (s) => decodeURIComponent(escape(s));

const FILE = "mrk.JSON";  // set file 

$(document).ready(function(){
      $.getJSON("../chat/"+FILE, (result) => {

            var groupName = result.title;
            var groupMember = result.participants;
            var totalMessages = result.messages.length;
            var messages = result.messages;
            

            $.each(groupMember, function(member){
                 let name =  groupMember[member].name.split(" ")
                 let firstName = decode_utf8(name[0])
                 let lastName = decode_utf8(name[name.length-1])

                 groupMember[member].numberOfmessage = 0
                 groupMember[member].text = []

                if(result.participants.length>2){
                  $('#memberTable tr:last').after(`<tr><td>${++member}</td>
                                                      <td>${firstName}</td><td>${lastName}</td></td>
                                                      <td>${groupName}</td></td></tr>`);
                }else{
                  $('#memberTable tr:last').after(`<tr><td>${++member}</td>
                                                      <td>${firstName}</td><td>${lastName}</td></td>
                                                      <td>${decode_utf8(result.participants[0].name)} / ${decode_utf8(result.participants[1].name)}</td></td></tr>`);
                }
            });   
            if(result.participants.length>2){
                  $('#groupName').append(`<strong> group  ${groupName}</strong>`)
            } 
            
            console.log(groupMember)
          
            $.each(messages, function(member){
                  var sender = messages[member].sender_name;
                   for(var i = 0; i<groupMember.length; i++){
                        if(decode_utf8(groupMember[i].name) == decode_utf8(sender)){
                              groupMember[i].numberOfmessage++;
                              groupMember[i].text.push(" "+decode_utf8(messages[member].content));
                              break;
                        }
                   }       
            });

            var totalText = 0;
             
            //chatStatTable
            for (var i = 0; i < groupMember.length; i++){
                

                  $('#chatStatTable tr:last').after(`<tr><td>${decode_utf8(groupMember[i].name)}</td>
                                                      <td>${groupMember[i].numberOfmessage}</td>
                                                      </td><td>${((groupMember[i].numberOfmessage/totalMessages)*100).toFixed(2)}%</td></td>
                                                      <td>${totalMessages}</td></tr>`);
            }

            for(var i = 0; i < groupMember.length; i++){
                  var numberOfWord = groupMember[i].text.join(" ").split(" ").length
                  totalText+=numberOfWord;
            }

            
            for (var i = 0; i < groupMember.length; i++){

                  var memberTopWord = topHundredWords(groupMember[i].text.join(" "))
                  var numberOfWord = groupMember[i].text.join(" ").split(" ").length

                  var li = `<li><em>${decode_utf8(groupMember[i].name)}</em><span>${((numberOfWord/totalText)*100).toFixed(2)}</span></li>`;
                  $("#chart").append(li);
       
                  $('#chatWordTable tr:last').after(`<tr><td>${decode_utf8(groupMember[i].name)}</td>
                                                      <td>${numberOfWord}</td>
                                                      </td><td>${((numberOfWord/totalText)*100).toFixed(2)}%</td></td>
                                                      <td>${memberTopWord.join(" - ")}</td>
                                                      <td>${totalText}</td>
                                                      `);
                                                                     
            }

            createPie(".pieID.legend", ".pieID.pie");
    });
  });


  let topHundredWords = text => {
    let dict = new Map();
    text.replace(/[A-z']+(?=[ ]+|$)/g, match => {
        let word = match.toLowerCase();
        dict.set(word, dict.has(word) ? dict.get(word) + 1 : 1);
    });
    dict.delete("'");
    return [...dict].sort((a, b) => b[1] - a[1]).map(a => a[0]).slice(0, 100);
};
  



function sliceSize(dataNum, dataTotal) {
      return (dataNum / dataTotal) * 360;
    }
    
    function addSlice(sliceSize, pieElement, offset, sliceID, color) {
      $(pieElement).append("<div class='slice "+sliceID+"'><span></span></div>");
      var offset = offset - 1;
      var sizeRotation = -179 + sliceSize;
      $("."+sliceID).css({
        "transform": "rotate("+offset+"deg) translate3d(0,0,0)"
      });
      $("."+sliceID+" span").css({
        "transform"       : "rotate("+sizeRotation+"deg) translate3d(0,0,0)",
        "background-color": color
      });
    }
    function iterateSlices(sliceSize, pieElement, offset, dataCount, sliceCount, color) {
      var sliceID = "s"+dataCount+"-"+sliceCount;
      var maxSize = 179;
      if(sliceSize<=maxSize) {
        addSlice(sliceSize, pieElement, offset, sliceID, color);
      } else {
        addSlice(maxSize, pieElement, offset, sliceID, color);
        iterateSlices(sliceSize-maxSize, pieElement, offset+maxSize, dataCount, sliceCount+1, color);
      }
    }
    function createPie(dataElement, pieElement) {
      var listData = [];
      $(dataElement+" span").each(function() {
        listData.push(Number($(this).html()));
      });
      var listTotal = 0;
      for(var i=0; i<listData.length; i++) {
        listTotal += listData[i];
      }
      var offset = 0;
      var color = [
        "cornflowerblue", 
        "olivedrab", 
        "orange", 
        "tomato", 
        "crimson", 
        "purple", 
        "turquoise", 
        "forestgreen", 
        "navy", 
        "gray"
      ];
      for(var i=0; i<listData.length; i++) {
        var size = sliceSize(listData[i], listTotal);
        iterateSlices(size, pieElement, offset, i, 0, color[i]);
        $(dataElement+" li:nth-child("+(i+1)+")").css("border-color", color[i]);
        offset += size;
      }
    }
   
    

  
