/*
 * Customer Management UI script for Store-POS
 * Handles listing, creating, editing, and deleting customers within the #customerList modal
 */
(function() {
    // Base API path for customers endpoints
    const apiBase = 'http://localhost:8001/api/customers/';
  
    // Expose showCustomer so buttons like #viewCustomer can load and display the list
    $.fn.showCustomer = function() {
      loadCustomerTable();
      return this;
    };
    function loadCustomers() {
        $.get(api + 'customers/all', function (customers) {
          const $dropdown = $('#customer');
          $dropdown.html(`<option value="0" selected="selected">לקוח מזדמן</option>`);
      
          customers.forEach(cust => {
            const optionValue = JSON.stringify({ id: cust._id, name: cust.name });
            $dropdown.append(`<option value='${optionValue}'>${cust.name}</option>`);
          });
      
          $dropdown.trigger('chosen:updated'); // if using Chosen.js
        });
      }
      
    // Fetch and render customers into the table body #customer_list
    function loadCustomerTable() {
      // Show loading indicator in modal header
      $('#customerList .loading').show();
      $('#customerId').val('');
      $.get(apiBase + 'all', function(customers) {
        $('#customerList .loading').hide();
        const tbody = $('#customer_list').empty();
  
        customers.forEach(cust => {
          if (cust._id==='') { return;}
          tbody.append(
            `<tr data-id="${cust._id}">
              <td>${cust._id}</td>
              <td>${cust.name}</td>
              <td>${cust.phone || ''}</td>
              <td>${cust.email || ''}</td>
              <td>${cust.address || ''}</td>
              <td>${cust.balance || 0}</td>
              <td>
                <button class="btn btn-sm btn-info edit-customer">ערוך</button>
                <button class="btn btn-sm btn-danger delete-customer">מחק</button>
              </td>
            </tr>`
        )}
        );
      }).fail(function() {
        $('#customerList .loading').hide();
        alert('Error loading customers.');
      });
    }
  
     // when someone clicks “ערוך”
  $('#customerList').on('click', '.edit-customer', function(){
    const custId = $(this).closest('tr').data('id');
    $.get(apiBase + 'customer/' + custId)
      .done(data => {
        const form = $('#newCustomer form');
        form.find('input[name="_id"]').val(data._id);
        form.find('input[name="name"]').val(data.name);
        form.find('input[name="phone"]').val(data.phone);
        form.find('input[name="email"]').val(data.email);
        form.find('input[name="address"]').val(data.address);
        form.find('input[name="balance"]').val(data.balance);
        $('#customerFormTitle').text('עריכת לקוח');
        $('#customerSaveBtn').text('עדכן לקוח');
        $('#newCustomer').modal('show').css('z-index', 1060);
       
      })
      .fail(() => alert('שגיאה בטעינת פרטי הלקוח'));
  });
  $('#openNewCustomerStandalone').on('click', function () {
    // Step 1: open only newCustomer
    $('#customerId').val('');
    $('#saveCustomer')[0].reset();                    // native reset()
  
   
    // restore default title
    $('#customerFormTitle').text('לקוח חדש');
    $('#newCustomer').modal('show');
    $('#customerList').modal('hide');

  });
  
  // Step 2: after newCustomer closes, reopen customerList
  $('#newCustomer').on('hidden.bs.modal', function () {
    $('#customerList').modal('show');
  });
  
  $('#newCustomer').on('hidden.bs.modal', function () {
    if ($('#customerList').is(':visible')) {
      $('#customerList').showCustomer();
    }

  });

    // Handle row deletion
    $('#customerList').on('click', '.delete-customer', function() {
      if (!confirm('מחק לקוח זה?')) return;
      const id = $(this).closest('tr').data('id');
  
      $.ajax({
        url: apiBase + `customer/${id}`,
        method: 'DELETE'
      }).done(loadCustomerTable)
        .fail(function() { alert('Error deleting customer.'); });
    });
  
    // Handle create/update via shared modal form (#customerModal)
    $('#newCustomer form').submit(function(e) {
      e.preventDefault();
      const form = $(this);
      const id = form.find('input[name="_id"]').val();
      const url = apiBase + 'customer';
      const method = id ? 'PUT' : 'POST';
  
      $.ajax({ url, method, data: form.serialize() })
        .done(function() {
          $('#newCustomer').modal('hide');
          loadCustomerTable();
        })
        .fail(function() { alert('Error saving customer.'); });
    });
  
    // Hide loading spinner initially
    $(document).ready(function() {
      $('#customerList .loading').hide();
    });
  })();
  