'''
Created on 4 déc. 2017

@author: duff
'''
from django.urls import path

from . import views

urlpatterns = [
    path('test',views.testsnap),
    path('ajax',views.ajax),
    path('pageref',views.pageref),
     path('pagedon',views.pagedon),
     path('ups',views.simple_upload),  
     path('up',views.model_form_upload),
    # path('upload',views.upload),
    ]