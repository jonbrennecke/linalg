var linalg = linalg || {NAME:'Linear Algebra namespace'};

// small utility function for inline creation of arrays of length 'b' filled with value 'c'
function fill(b,c){
	a=[]; while(b--){a[b]=c} return a
}

// return u+v
linalg.add = function(u,v){
	return (function(i,a){while(i--){a[i]+=v[i]}return a})(u.length,u.slice())
}

// return the angle between two vectors u and v
linalg.angle = function(u,v){
	return Math.acos(linalg.dot(u,v)/(u.length*v.length));
}

// return the cross product of the vectors u and v
// assumes u and v are 3-dimensional vectors
linalg.cross = function(u,v){
	return [u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]]
}

// return the dot product of the vectors u and v
linalg.dot = function(u,v){
	return (function(a,i){while(i--){a+=u[i]*v[i]}return a})(0,u.length)
}

// return the euclidean distance between the vectors u and v
linalg.dist = function(u,v){
	s=linalg.sub(u,v);
	return linalg.dot(s,linalg.transpose(s))
}

// orthogonalize or orthonormalize a matrix (or a set of vectors) 'v' by the Gram-Schmidt process
// if the extra boolean parameter is set, return normalized vectors
linalg.gramSchmidt = function(v,bool){
	z = [];
	for(var i=0;i<v.length;i++){
		z[i]=i?linalg.sub(v[i],(function(j,s){
			while(j--){
				s=linalg.add(s,linalg.proj(v[i],z[j]));
			}
			return s
		})(i,[0,0,0])):v[i];
		if(bool) z[i]=linalg.normalize(z[i]);
	}
	return z
}

// return the norm of a vector 'v'
linalg.norm = function(v){
	return Math.sqrt((function(a,i){while(i--){a+=v[i]*v[i]}return a})(0,v.length));
}

// return the unit vector of 'v'
linalg.normalize = function(v){
	var n=linalg.norm(v)
	return (function(i,a){while(i--){a[i]/=n}return a})(v.length,v.slice())
}

// return the scalar projection of vector u onto v
linalg.projScalar = function(u,v){
	return linalg.dot(u,linalg.normalize(v));
}

// return the vector projection of vector u onto v
linalg.proj = function(u,v){
	return (function(i,a,s){while(i--){a[i]*=s}return a})(u.length,linalg.normalize(v.slice()),linalg.projScalar(u.slice(),v.slice()))
}

// reshape a matrix
linalg.reshape = function(m){

}

// return the shape of a matrix m as the array [m,n]
linalg.shape = function(m){
	return [m.length,m[1].length]
}

// return a vector 'v' ssubdivided by step 's'
linalg.subdiv = function(v,s){
	return (function(i,a){while(i--){a[i]=v.slice(i*s,(i+1)*s)}return a})(Math.floor(v.length/s),[])    
}

// return u-v
linalg.sub = function(u,v){
	return (function(i,a){while(i--){a[i]-=v[i]}return a})(u.length,u.slice())
}

// return the (scalar) sum of the elements in a vector 'v'
linalg.sum = function(v){
	return (function(a,i){while(i--){a+=v[i]}return a})(0,v.length);
}

// return the transpose of a vector (or matrix) v
linalg.transpose = function(v){
	s = linalg.shape(v);
	l = s[1]*s[0];
	return (function(a,k){
		for(var i=0;i<l;i++){
			a[i!=l-1?(s[0]*i)%(l-1):l-1]=v[Math.floor(i/s[1])][i%s[1]];
		}
		return linalg.subdiv(a,2)
	})(fill(l,0),v.length)
}
