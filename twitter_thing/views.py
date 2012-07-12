from django.shortcuts import render_to_response
# from django.template import Context, loader
from django.http import HttpResponse

def puppies(request):
	return HttpResponse("Hello, puppies")

# def index(request):
# 	t = loader.get_template('index.html')
# 	c = Context({})
# 	r = HttpResponse(t.render(c))
# 	r['Access-Control-Allow-Origin'] = '*'
# 	return r

def index(request):
	return render_to_response('index.html', {})