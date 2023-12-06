$(document).ready(function(){
    var notifikasi_toast = function(target,color,msg){
        target.find('.toast_alert_container').remove();
        var el_notif = `<div aria-live="polite" aria-atomic="true" class="bg-dark position-relative toast_alert_container">
                            <div class="toast-container position-fixed start-50 translate-middle-x" id="toastPlacement" style="top:10%">
                                <div class="toast notifikasi-alert align-items-center text-bg-${color} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                                    <div class="d-flex">
                                        <div class="toast-body">
                                            ${msg}
                                        </div>
                                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                                    </div>
                                </div>
                            </div>
                        </div>`;
        target.prepend(el_notif);
        $('.notifikasi-alert').toast('show');
    }
    var image_picker_id = 1;
    var image_picker_id2 = 100;
    var max_allowed_pick_image = 3;
    var max_allowed_pick_image2 = 6;
    var image_picker_el = function(target,image_picker_id_,name){
        var image_picker = `<div class="col-6 col-lg-4 mb-2 picker_produk_${image_picker_id_}">
                            <div class="upload-btn-wrapper">
                                <button class="btn">
                                    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 12.5001L3.75159 10.9675C4.66286 10.1702 6.03628 10.2159 6.89249 11.0721L11.1822 15.3618C11.8694 16.0491 12.9512 16.1428 13.7464 15.5839L14.0446 15.3744C15.1888 14.5702 16.7369 14.6634 17.7765 15.599L21 18.5001" stroke="#000000" stroke-width="1.5" stroke-linecap="round"/>
                                        <path d="M15 5.5H18.5M18.5 5.5H22M18.5 5.5V9M18.5 5.5V2" stroke="#000000" stroke-width="1.5" stroke-linecap="round"/>
                                        <path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 10.8717 2 9.87835 2.02008 9M12 2C7.28595 2 4.92893 2 3.46447 3.46447C3.03965 3.88929 2.73806 4.38921 2.52396 5" stroke="#000000" stroke-width="1.5" stroke-linecap="round"/>
                                    </svg>
                                    <p>Foto</p>
                                    <img src="" id="output" class="image_thumbnails_previews_${image_picker_id_} d-none image_primary ">
                                </button>
                                <input type="file" name="${name}[]" data-pick="${image_picker_id_}" data-container="${target}" class="fotoimg pickimage" data-imgtype="primary" accept="capture=camera,image/*">
                                <div class="remove-images-upload-select rm_img_upload_${image_picker_id_}" data-container="${target}" data-pick="${image_picker_id_}"><svg width="13px" height="13px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"/></svg></div>
                            </div>
                        </div>`;
        $(target).append(image_picker)
        image_picker_id++;
        image_picker_id2++;
    };
    image_picker_el('.picker_image_produk',image_picker_id,'produkimage')
    image_picker_el('.picker_image_produk_lokbok',image_picker_id2,'lookbook')

    const compressImage = async (file, { quality = 1, type = file.type }) => {
        const imageBitmap = await createImageBitmap(file);
        const canvas = document.createElement('canvas');
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imageBitmap, 0, 0);
        const blob = await new Promise((resolve) =>
            canvas.toBlob(resolve, type, quality)
        );
        return new File([blob], file.name, {
            type: blob.type,
        });
    };
    let savedFiles = [];
    $(document).on('change','.pickimage', async function(e){
        const targetpreview = e.target.attributes[2].value;
        const { files } = e.target;
        var containers = $(this).data('container');
        console.log(containers);
        if (!files.length){
            const id_element = $(this).data('pick');
            $('.picker_produk_'+id_element).remove();
            if(containers == '.picker_image_produk' && $(containers).children().length < max_allowed_pick_image){
                image_picker_el(containers,image_picker_id,'produkimage');
            }else if(containers == '.picker_image_produk_lokbok' && $(containers).children().length < max_allowed_pick_image2){
                image_picker_el(containers,image_picker_id2,'lookbook')
            }
        };
        const dataTransfer = new DataTransfer();
        for (const file of files) {
            if (!file.type.startsWith('image')) {
                dataTransfer.items.add(file);
                continue;
            }
            const compressedFile = await compressImage(file, {
                quality: 0.3,
                type: 'image/jpeg',
            });
            dataTransfer.items.add(compressedFile);
        }
        e.target.files = dataTransfer.files;
        savedFiles.push(e.target.files);
        console.log(e.target.files);
        if (e.target.files && e.target.files[0]) {
            var reader = new FileReader();
            reader.onload = function (b) {
                $('.rm_img_upload_'+targetpreview).addClass('show');
                $('.image_thumbnails_previews_'+targetpreview).attr('src', b.target.result);
                console.log('.image_thumbnails_previews_'+targetpreview)
                $('.image_thumbnails_previews_'+targetpreview).removeClass('d-none');
                if(containers == '.picker_image_produk' && $(containers).children().length < max_allowed_pick_image){
                    image_picker_el(containers,image_picker_id,'produkimage')
                }else if(containers == '.picker_image_produk_lokbok' && $(containers).children().length < max_allowed_pick_image2){
                    image_picker_el(containers,image_picker_id2,'lookbook')
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });
    const file_chose_storage = {};
    var index_fils = 1;
    var itemDefault = {type:null,data:null}
    file_chose_storage[index_fils] = itemDefault;
    // 
    const renderFilePreview = function(data){
        // var el;
        // console.log(Object.keys(data).length);
        if(Object.keys(data).length <= max_allowed_pick_image2){
            if(Object.keys(data).length == max_allowed_pick_image2){
                $('.button-add-images').addClass('d-none');
            }else{
                $('.button-add-images').removeClass('d-none');
            }
            $('.list_image_lookbook').contents().not('.button-add-images').remove();
            // console.log(data);
            $.each(data, function(k,v){
                if(v.type == 'upload'){
                    var reader = new FileReader();
                    reader.onload = function (b) {
                        // console.log(v);
                        var el = '<div class="col-6 col-lg-4 mb-2 img_chosed">'
                        el += '<img src="'+b.target.result+'" id="output" class=""><div class="remove-images-upload-select" data-index="'+k+'"><svg width="13px" height="13px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"/></svg></div>'
                        el += '</div>';
                        $('.button-add-images').before(el);
                    }
                    reader.readAsDataURL(v.data);
                }else{
                    var el = '<div class="col-6 col-lg-4 mb-2 img_chosed">'
                    el += '<img src="'+v.data+'" id="output" class=""><div class="remove-images-upload-select" data-index="'+k+'"><svg width="13px" height="13px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"/></svg></div>'
                    el += '</div>';
                    $('.button-add-images').before(el);
                }
            })
        }
    }
    if($('.data_img_lookbook').length > 0){
        var data_img_lookbook = jQuery.parseJSON($('.data_img_lookbook').val());
        $.each(data_img_lookbook, function(k,v){
            let newItem = { ...itemDefault }; 
            newItem.type = 'database';
            newItem.data = v.file_path;
            // file_chose_storage[index_fils] = itemDefault;
            file_chose_storage[index_fils] = newItem;
            // file_chose_storage[index_fils].data = v.file_path
            index_fils++
        })
        // console.log(file_chose_storage);
        renderFilePreview(file_chose_storage)
    }
    $(document).on('change','.upload-image-multi > .chosefile', async function(e){
        e.preventDefault(0);
        const { files } = e.target;
        const dataTransfer = new DataTransfer();
        for (const file of files) {
            if (!file.type.startsWith('image')) {
                dataTransfer.items.add(file);
                continue;
            }
            const compressedFile = await compressImage(file, {
                quality: 0.3,
                type: 'image/jpeg',
            });
            dataTransfer.items.add(compressedFile);
        }
        e.target.files = dataTransfer.files;
        console.log(file_chose_storage);
        // savedFiles.push(e.target.files);
        // file_chose_storage.push(e.target.files);
        $('.button-add-images').removeClass('d-none');
        if (files.length){
            if (!file_chose_storage[index_fils]) {
                file_chose_storage[index_fils] = { ...itemDefault };
            }
            file_chose_storage[index_fils].type = 'upload';
            file_chose_storage[index_fils].data = e.target.files[0]
            index_fils++;
            renderFilePreview(file_chose_storage)
        }
        // console.log(file_chose_storage)
    })


    $(document).on('click','.remove-images-upload-select',function(e){
        e.preventDefault(0)
        const id_element = $(this).data('pick');
        var containers = $(this).data('container');
        var index_data = $(this).data('index');
        delete file_chose_storage[index_data]
        renderFilePreview(file_chose_storage);
        // if($('.picker_image_produk').children().length == max_allowed_pick_image){
        //     image_picker_el(image_picker_id);
        // }
        if($(containers == '.picker_image_produk' && containers).children().length == max_allowed_pick_image - 1 || $(containers).children().length == max_allowed_pick_image){
            image_picker_el(containers,image_picker_id,'produkimage')
        }else if(containers == '.picker_image_produk_lokbok' && $(containers).children().length == max_allowed_pick_image2 - 1 || $(containers).children().length == max_allowed_pick_image2){
            image_picker_el(containers,image_picker_id2,'lookbook')
        }
        $('.picker_produk_'+id_element).remove();
        // console.log($('.picker_image_produk').children().length);
    })

    function convertToSlug( str ) {
        str = str.replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,.<>?\s]/g, ' ')
                 .toLowerCase();
        str = str.replace(/^\s+|\s+$/gm,'');
        str = str.replace(/\s+/g, '-');   
        return str
    }
    $(document).on('keyup','.nama_brand',function(e){
        e.preventDefault(0);
        $('.input_allow_url_toko').val(convertToSlug($(this).val()));
    });


    $(document).on('submit','#barcode_create', function(e){
        e.preventDefault(0);
        var btn = $(this).find('.barcode_create');
        var form = $(this);
        btn.attr('disabled', true);
        var defaultText = btn.data('defaulttext');
        const spinerloading = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Loading...';
        btn.html(spinerloading);

        var formData = new FormData($('#barcode_create')[0]);
        // file_chose_storage.forEach(file => {
        $.each(file_chose_storage, function(k,v){
            formData.append('lookbook[]', v.data);
            console.log(v);
        });
        // console.log(formData);
        $.ajax({
            url: form.attr("action"),
            type: 'POST',
            // data: form.serialize(),
            data : formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(response) {
                btn.attr('disabled', false);
                const spinerloading = defaultText;
                btn.html(spinerloading);
                
                var data = jQuery.parseJSON(response);
                notifikasi_toast($(document).find('.main-containers'),data.color,data.msg);
                if (data.status == true) {
                    $('#barcode_create')[0].reset();
                    setTimeout(() => {
                        window.location.href = data.redirect_url;
                    }, 500);
                } else {
                    $('html, body').animate({
                        scrollTop: 0
                    }, 0);
                    // $('.notif_Kirim').html('<i class="fa fa-times me-3"></i>'+data.msg).css('width','max-content');
                }
            },
            error: function(xhr, status, error) {
                btn.attr('disabled', false);
                const spinerloading = defaultText;
                btn.html(spinerloading);
            }
        });
       
    })

    $(document).on('submit','#profile_save', function(e){
        e.preventDefault(0);
        var btn = $(this).find('.profile_save');
        var form = $(this);
        btn.attr('disabled', true);
        var defaultText = btn.data('defaulttext');
        const spinerloading = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Loading...';
        btn.html(spinerloading);

        var formData = new FormData($('#profile_save')[0]);
        // savedFiles.forEach(file => {
        //     formData.append('produkimage[]', file[0]);
        // });
        $.ajax({
            url: form.attr("action"),
            type: 'POST',
            // data: form.serialize(),
            data : formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(response) {
                btn.attr('disabled', false);
                const spinerloading = defaultText;
                btn.html(spinerloading);
                var data = jQuery.parseJSON(response);
                if(data.status){
                    $('.input_url_toko').attr('disabled',true);
                }
                notifikasi_toast($(document).find('.main-containers'),data.color,data.msg);
            },
            error: function(xhr, status, error) {
                btn.attr('disabled', false);
                const spinerloading = defaultText;
                btn.html(spinerloading);
            }
        });
       
    })

})