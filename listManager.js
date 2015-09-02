var _listManager = function(getListUrl, listType){
	
	var _pageCounter = function(){
		var pageCount = 1;
		var oldPageCount = 0;
		return {
			getPageCount : function(){
				return pageCount; 
			},
			setNextPageCount : function(){
				pageCount++; 
			},
			getOldPageCount : function(){
				return oldPageCount; 
			},
			setOldPageCount : function(){
				oldPageCount = pageCount; 
			}
		}
	}();
	
	var getList = function(){
		
		if(_pageCounter.getPageCount() != _pageCounter.getOldPageCount()){
			
			_pageCounter.setOldPageCount();
			
			$.ajax({
			    type: "GET",
			    url: getListUrl,
			    data: {pageIndex : _pageCounter.getPageCount()},
			    success : function(data, textStatus, jqXHR) {
			    	if(data.result.length>0){
			    		
			    		$.each(data.result, function(k,v){
			    			setDataToList(v);
			    		});
			    		if(data.result.length == 20) _pageCounter.setNextPageCount();
			    	}
				}
			});	
		}
	}
	
	var setDataToList = function(notice){
		var newLine = $('#listTemplate').clone();
		
		var title = notice.title + (listType=='notice'?'<span>'+notice.dispStDy+notice.dispStHour+'</span>':'');
		
		newLine.find('a').html(title);
		newLine.find('div .text').html(notice.content);
		
		newLine.on('click', function(e){
		    e.preventDefault();
		    var $this = $(this);
		    var $content = $this.find('>.list-content');
		    if ($this.hasClass('now')) {
		      $this.removeClass('now');
		      $content.slideUp('fast');
		    } else {
		    	var $now = $('.now');
		        if($now.length > 0){
		          $now.removeClass('now');
		          $now.find('>.list-content').slideUp('fast');
		        }
		        $this.addClass('now');
		        $content.slideDown('fast');
		    }
		  });
		
		$('.link-list').append(newLine);
		newLine.show();
	}
	
	
	getList();
  	$(window).scroll(function(){  
		if  ($(window).scrollTop() / ($(document).height() - $(window).height()) > 0.9){
			getList();
		}  
	}); 
	
	
}
