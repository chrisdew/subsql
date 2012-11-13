start 
  = "select" el:ExprList fc:FromClause?
    { return {select:{exprs:el,from:fc}}; }
  / "create" _ "table" _ TableName _? "(" lines:CreateLines _? ")" 
    { return {createTable:lines}; }

CreateLines
  = _? head:CreateLine tail:( _? "," _? CreateLine)* 
    { var result = [head];
      for (var i in tail) result.push(tail[i][3]);
      return result; }

CreateLine
  = field:Identifier _ type:FieldType pk:(_ "primary key")? ai:(_ "auto_increment")
    { return {field:field, type:type, pk:pk?true:undefined, ai:ai?true:undefined}; }

FieldType
  = "integer"
  / "varchar"


ExprList
  = _ head:Expr tail:( _? "," _? Expr)* 
    { var result = [head];
      for (var i in tail) result.push(tail[i][3]);
      return result; }

Expr
  = Identifier

FieldName
  = Identifier

FromClause
  = _ "from" tl:TableList
    { return tl; }

TableList
  = _ head:TableName tail:( _? "," _? TableName)*
    { var result = [head];
      for (var i in tail) result.push(tail[i][3]);
      return result; }

TableName
  = Identifier



_
  = WhiteSpace
    { return undefined; }

WhiteSpace "whitespace"
  = [ \t\v\f]

LineTerminator
  = [\n\r]


SingleLineComment
  = "--" (!LineTerminator SourceCharacter)*


Identifier "identifier"
  = !ReservedWord name:IdentifierName { return name; }

IdentifierName "identifier"
  = head:IdentifierStart tail:IdentifierPart* {
      return head + tail.join("");
    }

IdentifierStart
  = [a-z]

IdentifierPart
  = [a-z]

SourceCharacter
  = .

ReservedWord
  = "select"
  / "from"
