
start 
  = "select" _ "*" fc:FromClause _ wc:WhereClause
    { return {selectStar:{from:fc,where:wc}}; }
  / "select" _ "*" fc:FromClause
    { return {selectStar:{from:fc}}; }
  / "push" _ "*" fc:FromClause _ wc:WhereClause
    { return {pushStar:{from:fc,where:wc}}; }
  / "push" _ "*" fc:FromClause
    { return {pushStar:{from:fc}}; }
  / "select" _ el:ExprList fc:FromClause
    { return {select:{exprs:el,from:fc}}; }
  / "select" _ el:ExprList
    { return {select:{exprs:el}}; }
  / "push" _ el:ExprList fc:FromClause?
    { return {push:{exprs:el,from:fc}}; }
  / "create" _ "table" _ tn:TableName _? "(" _? lines:CreateLines _? ")" 
    { return {createTable:{name:tn, fields:lines}}; }
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
  = "where" _ b:Bool
    { return {expr:b}; }
    
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
  = head:([1-9]) tail:([0-9]*) { tail.unshift(head); return parseInt(tail.join(''), 10); }
  
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
  = head:Expr tail:( _? "," _? Expr)* 
    { var result = [head];
      for (var i in tail) result.push(tail[i][3]);
      return result; }

Expr
  = b:Bool
    { return {expr:b}; }
  / Additive

Bool
  = arg0:Bool1 _ "or" _ arg1:Bool1
    { return {fn:"or",args:[arg0,arg1]}; }
  / Bool1

Bool1
  = arg0:Bool2 _ "and" _ arg1:Bool2
    { return {fn:"and",args:[arg0,arg1]}; }
  / Bool2

Bool2
  = arg0:Additive _? "=" _? arg1:Additive
    { return {fn:"equal",args:[arg0,arg1]}; }
  / arg0:Additive _? ">" _? arg1:Additive
    { return {fn:"gt",args:[arg0,arg1]}; }
  / arg0:Additive _? ">=" _? arg1:Additive
    { return {fn:"gte",args:[arg0,arg1]}; }
  / arg0:Additive _? "<" _? arg1:Additive
    { return {fn:"lt",args:[arg0,arg1]}; }
  / arg0:Additive _? "<=" _? arg1:Additive
    { return {fn:"lte",args:[arg0,arg1]}; }

Additive
  = arg0:Multiplicative _? "+" _? arg1:Additive
    { return {fn:"add",args:[arg0,arg1]}; }
  / arg0:Multiplicative _? "-" _? arg1:Additive
    { return {fn:"sub",args:[arg0,arg1]}; }
  / Multiplicative

Multiplicative
  = arg0:Primary _? "*" _? arg1:Multiplicative
    { return {fn:"mult",args:[arg0,arg1]}; }
  / arg0:Primary _? "/" _? arg1:Multiplicative
    { return {fn:"div",args:[arg0,arg1]}; }
  / Primary

Primary
  = Function
  / FieldRef
  / Value

FieldName
  = Identifier
  
FieldRef
  = fn:Identifier
    { return {field:fn}; }

Function
  = fn:Identifier "(" el:ExprList ")"
    { return {fn:fn,args:el}; }
  / fn:Identifier "()"
    { return {fn:fn,args:[]}; }

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
