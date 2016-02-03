<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="row">
	<div id="footer" class="col-xs-12">
		<a href="javascript:changelocale('en');">English</a> |
		<a href="javascript:changelocale('zh_CN');">中文 (简体)</a>
	</div>
	<script type="text/javascript">
	function changelocale(locale){
		
		var recentURL = window.location.href;
		
		
		console.log(recentURL)
		
		if(recentURL.indexOf("?")>0) {
			
			if(recentURL.indexOf("locale")>0) {
				
				var lastChar = window.location.href.substr(window.location.href.length - 1); 
				console.log(lastChar)
				if(lastChar=="#") recentURL = recentURL.substr(0, recentURL.length-1);
				
				var temp = recentURL.substring(0,recentURL.lastIndexOf("=")+1);
				
				window.location=temp+locale;
				
			}else
			{
				window.location=recentURL+'&locale='+locale;
			}
			
			
			
		}else
		{
			window.location=recentURL+'?locale='+locale;
			
		}
		
	}
	</script>
	<div id="footer" class="col-xs-12">
		2015 &copy; Brought to you by <a href="http://www.techstudio.com.sg/ " target="_blank">TechStudio Solutions Pte. Ltd.</a>
	</div>
</div>