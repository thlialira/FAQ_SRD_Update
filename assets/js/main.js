var headers = $('#accordion .accordion-header');
var contentAreas = $('#accordion .ui-accordion-content ').hide();
var expandLink = $('.accordion-expand-all');
var expandirAll = $('#expandirAll');
var searchbtn = $('.search-btn');

// add the accordion functionality
headers.click(function () {
   var panel = $(this).next();
   var isOpen = panel.is(':visible');

   // open or close as necessary
   panel[isOpen ? 'slideUp' : 'slideDown']()
      // trigger the correct custom event
      .trigger(isOpen ? 'hide' : 'show');

   // stop the link from causing a pagescroll
   return false;
});

// hook up the expand/collapse all
expandLink.click(function () {
   var isAllOpen = $(this).data('isAllOpen');
   contentAreas[isAllOpen ? 'hide' : 'show']()
      .trigger(isAllOpen ? 'hide' : 'show');
});

// when panels open or close, check to see if they're all open
contentAreas.on({
   // whenever we open a panel, check to see if they're all open
   // if all open, swap the button to collapser
   show: function () {
      var isAllOpen = !contentAreas.is(':hidden');
      if (isAllOpen) {
         expandLink.text('Retrair')
            .data('isAllOpen', true);
      }
   },
   // whenever we close a panel, check to see if they're all open
   // if not all open, swap the button to expander
   hide: function () {
      var isAllOpen = !contentAreas.is(':hidden');
      if (!isAllOpen) {
         expandLink.text('Expandir todos')
            .data('isAllOpen', false);
      }
   }
});


// Script para encontrar o alvo e redirecionar a página até o elemento
$(function () {

   // the input field
   var $input = $("input[type='search']"),
      // clear button
      $clearBtn = $("button[data-search='clear']"),
      // prev button
      $prevBtn = $("button[data-search='prev']"),
      // next button
      $nextBtn = $("button[data-search='next']"),
      // the context where to search
      $content = $(".expandir"),
      // jQuery object to save <mark> elements
      $results,
      // the class that will be appended to the current
      // focused element
      currentClass = "current",
      // top offset for the jump (the search bar)
      offsetTop = 50,
      // the current index of the focused element
      currentIndex = 0;

   /**
   * Jumps to the element matching the currentIndex
   */

   searchbtn.click(function jumpTo() {
      headers
      if ($results.length) {
         var position,
            $current = $results.eq(currentIndex);
         $results.removeClass(currentClass);
         if ($current.length) {
            $current.addClass(currentClass);
            position = $current.offset().top - offsetTop;
            window.scrollTo(0, position);
         }
      }
   });

   //função 'enter'
   $(document).on('keypress', function (e) {
      if (e.which == 13) {
         if ($results.length) {
            var position,
               $current = $results.eq(currentIndex);
            $results.removeClass(currentClass);
            
            //Ao dar enter, a função abre todos os cards e encontra a palavra
            var isAllOpen = $(this).data('isAllOpen');
            contentAreas[isAllOpen ? 'hide' : 'show']()
               .trigger(isAllOpen ? 'hide' : 'show');

            if ($current.length) {
               $current.addClass(currentClass);
               position = $current.offset().top - offsetTop;
               window.scrollTo(0, position);
            }
         }
      }
   });

   /**
   * Searches for the entered keyword in the
   * specified context on input
   */
   $input.on("input", function () {
      var searchVal = this.value;
      $content.unmark({
         done: function () {
            $content.mark(searchVal, {
               separateWordSearch: true,
               //Definição para encontrar palavra exata
               accuracy: "exactly",
               done: function () {
                  $results = $content.find("mark");
                  currentIndex = 0;
                  jumpTo();
               }
            });
         }
      });
   });

   /**
   * Clears the search
   */
   $clearBtn.on("click", function () {
      $content.unmark();
      $input.val("").focus();
   });

   /**
   * Next and previous search jump to
   */
   $nextBtn.add($prevBtn).on("click", function () {
      if ($results.length) {
         currentIndex += $(this).is($prevBtn) ? -1 : 1;
         if (currentIndex < 0) {
            currentIndex = $results.length - 1;
         }
         if (currentIndex > $results.length - 1) {
            currentIndex = 0;
         }
         jumpTo();
      }
   });
});