const expect=require("expect");

var generateMessage=require("./message.js");

describe("Generate Message",function(){
  it("should generate correct message object",function(){
    //now we create some dummy data
    let from="qwerty",
        text="dont make qwerty as a password",
        message=generateMessage(from,text);

        expect(typeof message.createdAt).toBe("number");
        expect(message).toMatchObject({from,text});
    });
});
