
const encode_utf8 = (s) => unescape(encodeURIComponent(s));
const decode_utf8 = (s) => decodeURIComponent(escape(s));

const FILE = "FILE_NAME.JSON";  // set file 

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
       
                  $('#chatWordTable tr:last').after(`<tr><td>${decode_utf8(groupMember[i].name)}</td>
                                                      <td>${numberOfWord}</td>
                                                      </td><td>${((numberOfWord/totalText)*100).toFixed(2)}%</td></td>
                                                      <td>${memberTopWord.join(" - ")}</td>
                                                      <td>${totalText}</td>
                                                      `);
                                                      
            }


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
  



  
