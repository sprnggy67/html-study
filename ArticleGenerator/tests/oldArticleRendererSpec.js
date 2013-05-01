describe("OldArticleRenderer", function() {
 
  var typeLib;

  var navigationArticle = {
    "id":"001",
    "headline":"Best of Times",
    "style": {
      "textColor":"red",
      "backgroundColor":"blue"
    },
    "children":[
    {
      "id":"001.1",
      "headline":"Cardinal O'Malley complainant 'warned' of risk of damage to Church",
      "standFirst":"One of four men who made claims against Cardinal James O'Malley in the days before he resigned says he went public despite being warned he could damage the Catholic Church's reputation.",
      "body":"The ex-priest told the Observer he was disappointed by the 'cold disapproval' he faced for 'daring to break ranks'. In a rare demonstration of candid talk, Cardinal Merry Rant said that the church reprimanded him for speaking his mind in a recent pub crawl. 'I couldn't really help it, could I? I was sitting around with the other lads, having a few jars, when we started to talk about the crazy things which are known to happen in the vatican. So I told then about the time that O'Malley brought a dog in and hid it under the pulpit during a public cermon. Whenever it barked O'Malley pretended to cough, so no one would notice.",
      "image":"http://c.o0bg.com/rf/image_960w/Boston/2011-2020/2013/02/19/BostonGlobe.com/Regional/Images/POPE%20CARDINALS-1710151.jpg"
    },
    {
      "id":"001.2",
      "headline":"CITES meeting to deal with species 'extinction crisis'",
      "standFirst":"New plans to protect elephants, rhinos and other species will be discussed at a critical meeting that begins in Bangkok on Sunday.",
      "body":"Delegates will review the convention on the international trade in endangered species (CITES).",
      "image":"http://www.cites.org/gallery/Pics/CITES-logo.jpg"
    },
    {
      "id":"001.3",
      "headline":"Comic Relief: Red Nose night raises record £75m",
      "standFirst":"Celebrities and the public have helped this year's Comic Relief charity telethon raise a record £75m so far.",
      "body":"<p>Comedian Lenny Henry, a founder of the Red Nose Day fundraiser which is now in its 25th year, kicked off the live show on BBC One. <\/p>\r\n        <p>Music mogul Simon Cowell, singer Jessie J, comedian Peter Kay and boy band One Direction all made appearances. <\/p>\r\n        <p>There were also reinterpretations of hit TV shows the Vicar of Dibley and Call the Midwife.<\/p>\r\n        <p>And Ricky Gervais resurrected his David Brent character in a mini-episode of The Office.<\/p>\r\n        <p>David Walliams featured in a sketch alongside the likes of supermodel Kate Moss, footballer Frank Lampard, Hollywood stars Gwyneth Paltrow and Hugh Grant and veteran comedian Ronnie Corbett. <\/p>\r\n        <p>Meanwhile, across the country people dressed up during the day to help raise money for good causes in the UK and Africa.<\/p>\r\n        <img src=\"http:\/\/news.bbcimg.co.uk\/media\/images\/66426000\/jpg\/_66426574_66424950.jpg\" style=\"float:left;margin:5px;\" width=\"304\" height=\"171\" alt=\"Lenny Henry at the start of Comic Relief\" \/>\r\n        <p>The television broadcast began at 19:00 GMT, with Henry revealing a special gold Red Nose suit.<\/p>\r\n        <p>He said it had been &quot;25 years of truly incredible fundraising, truly incredible comedy and... truly incredible suits&quot;.<\/p>\r\n        <p>Shortly after 01:30 GMT, comedian Russell Brand announced the money raised stood at \u00A375,107,851 - passing 2011&#039;s total of \u00A374.3m.<\/p>\r\n        <p>Hosts on stage included Dermot O&#039;Leary, Claudia Winkleman and Jonathan Ross and former Dr Who actor David Tennant and footballer David Beckham were among those to appeal to the public to make donations.<\/p>\r\n        <p>One Direction, who have recorded this year&#039;s <a href=\"http:\/\/www.bbc.co.uk\/news\/entertainment-arts-21277822\" >official Red Nose Day single<\/a> - a mash-up of Blondie&#039;s One Way or Another and Teenage Kicks by The Undertones, performed.<\/p>\r\n        <p>And singer Jessie J made good on a long-standing pledge to <a href=\"http:\/\/www.bbc.co.uk\/newsbeat\/21272969\" >shave her head <\/a>for charity.<\/p>\r\n        <p>Earlier, two of the UK&#039;s biggest comedy names, Dawn French and Jennifer Saunders, popped up on BBC Radio 2.<\/p>\r\n        <p>They prepared for their stint by <a href=\"http:\/\/www.youtube.com\/watch?v=6NQczAe3YxE\" >familiarising themselves with the station&#039;s schedule and presenters<\/a>.<\/p>\r\n        <p>It saw them interrupt Ken Bruce&#039;s live show and &quot;threaten him&quot; with a vacuum cleaner.<\/p>\r\n        <img src=\"http:\/\/news.bbcimg.co.uk\/media\/images\/66414000\/jpg\/_66414187_brucefrenchsaunders.jpg\" style=\"float:right;margin:5px;\" width=\"304\" height=\"171\" alt=\"Dawn French and Jennifer Saunders with Ken Bruce\" \/>\r\n        <p>Celebrities including Dara O Briain, Melanie C, Jack Dee and Greg James took on the five-day Hell and High Water challenge, travelling down the 100km Zambezi River to raise \u00A31m for children in Zambia.<\/p>\r\n        <p>The group appeared on the telethon to tell viewers about their experiences in Africa.<\/p>\r\n        <p>Others to help out included Miranda Hart, who completed a &quot;Mad March&quot; challenge each day this week in different cities across England.<\/p>\r\n        <p>She also organised a real-life wedding ceremony in a matter of hours for Claire Gilchrist, 26, and Ben Springett, 28, at Old Marylebone Town Hall in central London - she only found out on the morning that she had to do it.<\/p>\r\n        <p>After the ceremony, she said: &quot;The pressure was on but it was about Claire and Ben. I was determined to do the best I could so I got Michael Ball and the McFly boys and all these surprises for them to add to the occasion. I&#039;m so thrilled.&quot;<\/p>\r\n",
      "image":"http://i2.cdnds.net/13/05/618x730/showbiz-comic-relief-red-nose-celebs-5.jpg"
    }
    ]
  };

  beforeEach(function() {
    typeLib = new ComponentTypeLib();
    typeLib.loadRegistry();
  });

  it("should be defined", function() {
    var renderer = new OldArticleRenderer(typeLib);
    expect(renderer).toBeDefined();
  });

  it("should navigate into shallow objects", function() {
    var renderer = new OldArticleRenderer(typeLib);

    var expectedOutput = "001";
    var actualOutput = renderer.findPath(navigationArticle, "id");
    expect(actualOutput).toEqual(expectedOutput);
  });

  it("should navigate into deep objects", function() {
    var renderer = new OldArticleRenderer(typeLib);

    var expectedOutput = "red";
    var actualOutput = renderer.findPath(navigationArticle, "style.textColor");
    expect(actualOutput).toEqual(expectedOutput);
  });

  it("should generate the first headline component", function() {
    var renderer = new OldArticleRenderer(typeLib);
    var template = {
      "name":"Simple Headline",
      "root":{
        componentType:"headline",
        dataPath:"children",
        dataIndex:0
      }
    };
    var expectedOutput = "<h1>Cardinal O'Malley complainant 'warned' of risk of damage to Church</h1>";
    var actualOutput = renderer.render(template, navigationArticle);
    expect(actualOutput).toEqual(expectedOutput);
  });

  it("should generate the second headline component", function() {
    var renderer = new OldArticleRenderer(typeLib);
    var template = {
      "name":"Simple Headline",
      "root":{
        componentType:"headline",
        dataPath:"children",
        dataIndex:1
      }
    };
    var expectedOutput = "<h1>CITES meeting to deal with species 'extinction crisis'</h1>";
    var actualOutput = renderer.render(template, navigationArticle);
    expect(actualOutput).toEqual(expectedOutput);
  });

  it("should generate the first body component", function() {
    var renderer = new OldArticleRenderer(typeLib);
    var template = {
      "name":"Simple Body",
      "root":{
        componentType:"body",
        dataPath:"children",
        dataIndex:0
      }
    };
    var expectedOutput = navigationArticle.children[0].body;
    var actualOutput = renderer.render(template, navigationArticle);
    expect(actualOutput).toEqual(expectedOutput);
  });

  it("should generate the second body component", function() {
    var renderer = new OldArticleRenderer(typeLib);
    var template = {
      "name":"Simple Body",
      "root":{
        componentType:"body",
        dataPath:"children",
        dataIndex:1
      }
    };
    var expectedOutput = navigationArticle.children[1].body;
    var actualOutput = renderer.render(template, navigationArticle);
    expect(actualOutput).toEqual(expectedOutput);
  });

  it("should generate the first image component", function() {
    var renderer = new OldArticleRenderer(typeLib);
    var template = {
      "name":"Simple Image",
      "root":{
        componentType:"image",
        dataPath:"children",
        dataIndex:0
      }
    };
    var expectedOutput = '<img src="http://c.o0bg.com/rf/image_960w/Boston/2011-2020/2013/02/19/BostonGlobe.com/Regional/Images/POPE%20CARDINALS-1710151.jpg">';
    var actualOutput = renderer.render(template, navigationArticle);
    expect(actualOutput).toEqual(expectedOutput);
  });

  it("should generate the first standfirst component", function() {
    var renderer = new OldArticleRenderer(typeLib);
    var template = {
      "name":"Simple StandFirst",
      "root":{
        componentType:"standFirst",
        dataPath:"children",
        dataIndex:0
      }
    };
    var expectedOutput = "<h2>One of four men who made claims against Cardinal James O'Malley in the days before he resigned says he went public despite being warned he could damage the Catholic Church's reputation.</h2>";
    var actualOutput = renderer.render(template, navigationArticle);
    expect(actualOutput).toEqual(expectedOutput);
  });

 });