var assert = require("assert"),
    htmljs = require("../html.min");

describe('htmljs', function() {

  describe('::tags', function() {
    it('should define methods for all tags', function() {
      var tags = ['a', 'abbr', 'acronym', 'address', 'area', 'b', 'big', 'blockquote', 'body', 'br', 'button', 'caption', 'cite', 'code', 'col', 'colgroup', 'dd', 'del', 'dfn', 'div', 'dl', 'dt', 'em', 'fieldset', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'html', 'hr', 'i', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'map', 'meta', 'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'q', 'samp', 'script', 'select', 'small', 'span', 'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'title', 'tr', 'tt', 'ul'];

      for (var i=0, len=tags.length; i<len; i++) {
        var tag = tags[i];
        assert.equal('function', typeof htmljs.htmljs[tag])
      }
    });
  });


  describe('#parseAttributes', function() {
    it('should correctly parse objects', function() {
      var attrs = { 'class': 'myClass', 'id': 'myId' }
      assert.equal(" class='myClass' id='myId'", htmljs.htmljs.parseAttributes(attrs));
    });

    it('should correctly parse objects with a data field', function() {
      var attrs = { id: 'myId', data: { one: 'one', two: 'two' } }
      assert.equal(" data-one='one' data-two='two' id='myId'", htmljs.htmljs.parseAttributes(attrs));
    });

    it('should correctly parse strings', function() {
      assert.equal(" id='myId' class='myClass'", htmljs.htmljs.parseAttributes("#myId.myClass"));
      assert.equal(" class='myClass' id='myId'", htmljs.htmljs.parseAttributes(".myClass#myId"));
    });

    it('should return an empty string for empty attributes', function() {
      assert.equal("", htmljs.htmljs.parseAttributes(null));
    });
  });


  describe('#tag', function() {
    it('should accept a content string', function() {
      assert.equal("<p>Hello World</p>", htmljs.p("Hello World"));
    });


    it('should create tags with empty bodies', function() {
      assert.equal("<p class='myClass'></p>", htmljs.p({ 'class': 'myClass' }));
    });


    it('should accept attributes string and content string', function() {
      assert.equal("<h1 id='myId' class='myClass'>Hello World</h1>", htmljs.h1("#myId.myClass", "Hello World"));
    });


    it('should accept a content function', function() {
      assert.equal("<div><h1>Inner Content</h1></div>", htmljs.div(function() {
        return htmljs.h1("Inner Content");
      }));
    });


    it('should accept a content function with inner attributes', function() {
      assert.equal("<div><p id='myId'>Inner Content</p></div>", htmljs.div(function() {
        return htmljs.p("#myId", "Inner Content");
      }));
    });


    it('should concate inner content items', function() {
      assert.equal("<ul class='myClass'><li>item one</li><li>item two</li></ul>", htmljs.ul('.myClass', function() {
        return htmljs.li("item one") + htmljs.li("item two")
      }));
    });
  });


  describe('helpers', function() {
    it('should define methods for all tags', function() {
      var types = ['button', 'checkbox', 'color', 'date', 'datetime', 'email', 'file', 'hidden', 'image', 'month', 'number', 'password', 'radio', 'range', 'reset', 'search', 'submit', 'tel', 'text', 'time', 'url', 'week'];

      for (var i=0, len=types.length; i<len; i++) {
        var type = types[i];
        assert.equal('function', typeof htmljs.htmljs[type+"_input"])
      }
    });


    it('should build text inputs', function() {
      var input = htmljs.text_input({ name: 'age', placeholder: 'Enter your age' });
      assert.equal("<input name='age' placeholder='Enter your age' type='text' />", input);
    });
  });


});
