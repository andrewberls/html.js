root =
if module? && module.exports?
  module.exports
else
  window


# Utility functions
merge   = (obj1, obj2) ->
  obj1[key] = val for key, val of obj2
  obj1

inArray = (ary, item)  -> ary.indexOf(item) > -1


htmljs = root.htmljs = {
  tags: """
    a abbr acronym address area b big blockquote body br button caption cite code col colgroup dd del dfn div dl dt em fieldset form h1 h2 h3 h4 h5 h6 head html hr i img input ins kbd label legend li link map meta object ol optgroup option p param pre q samp script select small span strong style sub sup table tbody td textarea tfoot th thead title tr tt ul
  """.split(" ")

  singleTags: """
    img input br hr
  """.split(" ")

  inputTypes: """
    button checkbox color date datetime email file hidden image month number password radio range reset search submit tel text time url week
  """.split(" ")


  # Parse specified HTML attributes and return a string formatted for a tag
  # Attributes can be specified as either an object or a string
  #
  # Ex: { 'class': 'myClass', 'id': 'myId', data: { 'num': 2 } }
  #   => "class='myClass' id='myId' data-num='2'"
  #
  # Ex: ".myClass#myId"
  #   => "class='myClass' id='myId'"
  #
  parseAttributes: (attrs) ->
    output = ''

    if attrs?
      switch typeof attrs
        when 'object'
          if attrs.data?
            output += " data-#{dkey}='#{val}'" for dkey, val of attrs.data
            delete attrs.data

          output += " #{key}='#{val}'" for key, val of attrs
          return output

        when 'string'
          attrs = attrs.match(/(\.\w+|#\w+)/gi) || []
          for attr in attrs
            type = attr[0]       # '.' or '#'
            val  = attr.slice(1) # Actual value

            switch type
              when '.' then output += " class='#{val}'"
              when '#' then output += " id='#{val}'"

          return output
        else return ''
    else
      return ''


  # Construct and return an HTML tag
  # Prefer calling specific methods such as "div('.className', 'content')" instead of this directly.
  tag: (name, attrs=null, content=null) ->
    if content?
      switch typeof content
        when 'function'
          # tag("div", "#id.class" function() {})
          result = content.call()

        when 'string'
          # tag("div", #id.class", "inner content")
          result = content

    else
      switch typeof attrs
        when 'function'
          # tag("div", function() {})
          result = attrs.call()
        when 'string'
          # tag("div", "inner content")
          result = attrs
        else
          result = ''


    attr_str = @parseAttributes(attrs)
    if inArray(@singleTags, name)
      return "<#{name}#{attr_str} />"
    else
      return "<#{name}#{attr_str}>#{result}</#{name}>"
}


# Generate a function to generate a tag
mkTagFunction = (name) ->
  (attrs, content) -> return htmljs.tag(name, attrs, content)


# Generate a function to generate an input tag
mkInputFunction = (type) ->
  (attrs) -> htmljs.tag("input", merge(attrs, { type: type }))


# Define tag methods
for tag in htmljs.tags
  htmljs[tag] = mkTagFunction(tag)
  root[tag]   = htmljs[tag] unless root[tag]?


# Define input helper methods
for type in htmljs.inputTypes
  fxnName = "#{type}_input"
  htmljs[fxnName] = mkInputFunction(type)
  root[fxnName]   = htmljs[fxnName] unless root[fxnName]?
