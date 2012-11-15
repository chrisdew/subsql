
start 
  = "select" el:ExprList fc:FromClause?
    { return {select:{exprs:el,from:fc}}; }
  / "subscribe" el:ExprList fc:FromClause?
    { return {subscribe:{exprs:el,from:fc}}; }
  / "create" _ "table" _ TableName _? "(" _? lines:CreateLines _? ")" 
    { return {createTable:{fields:lines}}; }
  / "use" _ DatabaseName
  / "create" _ DatabaseName
  / "insert into" _ tn:TableName _? "(" _? fields:FieldList _? ")" _? "values" _? "(" _? values:ValueList ")"
    { return {insert:{table:tn,fields:fields,values:values}}; }
  / "update" _ tn:TableName _ "set" _ sl:SetList _ wc:WhereClause
    { return {update:{table:tn,set:sl,where:wc}}; }
  
SetList
  = head:SetPair tail:( _? "," _? SetPair)*
    { var result = [head];
      for (var i in tail) result.push(tail[i][3]);
      return result; }
      
SetPair
  = f:FieldName _? "=" _? e:Expr
    { return {field:f,expr:e}; }
    
WhereClause
  = "where" _? e:Expr
    { return e; }
    
FieldList
  = head:FieldName tail:( _? "," _? FieldName)* 
    { var result = [head];
      for (var i in tail) result.push(tail[i][3]);
      return result; }
  
ValueList
  = head:Value tail:( _? "," _? Value)* 
    { var result = [head];
      for (var i in tail) result.push(tail[i][3]);
      return result; }
  
Value
  = Integer
  / String
  
Integer
  = value:([1-9][0-9]*) { return parseInt(value, 10); }
  
String
  = "\"" value:([a-z]*) "\"" { return value.join(''); }

DatabaseName
  = Identifier
  
CreateLines
  = _? head:CreateLine tail:( _? "," _? CreateLine)* 
    { var result = [head];
      for (var i in tail) result.push(tail[i][3]);
      return result; }

CreateLine
  = field:Identifier _ type:FieldType pk:(_ "primary key")? ai:(_ "auto_increment")?
    { var result = {field:field, type:type};
      if (pk) result.pk = true;
      if (ai) result.ai = true;
      return result; }

FieldType
  = "integer"
  / "varchar"
  / "datetime"


ExprList
  = _ head:Expr tail:( _? "," _? Expr)* 
    { var result = [head];
      for (var i in tail) result.push(tail[i][3]);
      return result; }

Expr
  = f:FieldName _? "=" _? v:Value
    { return {expr:{op:"=",field:f,value:v}}; }
  / Identifier
  / Value

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
  = [ \t\v\f\n\r]+

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