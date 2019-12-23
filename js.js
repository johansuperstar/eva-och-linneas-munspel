var localStorageKey = 'lessons';

var youtubeBaseUrl = 'https://www.youtube.com/embed/'
var lessons = [
    { name: 'Lär dig känna munspelet', youtubeId: 'tynItp0QR2o' },
    { name: 'Lär dig grunderna', youtubeId: '_CxMYWcCluw' },
    { name: 'Hur läser man noterna?', youtubeId: 'uijKdpEoVZM' },
    { name: 'Tips och tricks', youtubeId: 'Qld7XBdsRyU' },
    { name: 'Första låten - Oh Susanna', youtubeId: '4hnz9O-0uQ8' },    
    { name: 'Andra låten - When the Saints Go Marching In', youtubeId: 'HBB2ijN4p3g' },
    { name: 'Examensprov - Blowin\' in the wind', youtubeId: 'mMbyL7ObxcU' },
].map(function (x, index) {
    return {
        id: index,
        name: x.name, 
        videoSrc: youtubeBaseUrl + x.youtubeId, 
        completed: false 
    };
});

var merge = function (a, b, prop) {
    if (!a) return b;
    if (!b) return a;

    var reduced = a.filter(function (aitem) {
        return ! b.find(function (bitem) {
            return aitem[prop] === bitem[prop];
        });
    });
    return reduced.concat(b);
};

var getLocalStorageState = function () {
    var item = localStorage.getItem(localStorageKey);
    return item ? JSON.parse(item) : null;
};

var setLocalStorageState = function (state) {
    localStorage.setItem(localStorageKey, JSON.stringify(state));
};

var localStorageState = getLocalStorageState();
var state = merge(lessons, localStorageState);

if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

var on = function (event, parent, childSelector, handler) {
    parent.addEventListener(event, function (e) {
        if (!e.target) return;
        
        if (e.target.matches(childSelector)) {
            handler(e.target);
        }
    });
};

var compileTemplate = function (template, data) {
    var html = template;
    Object.keys(data).forEach(function (key) {
        html = html.replace('{{' + key + '}}', data[key]);
    });
    html = html.replace('checked="false"', '');

    var placeholder = document.createElement('div');
    placeholder.innerHTML = html.trim();
    return placeholder.firstChild; 
};

var lessonTemplate = document.querySelector('#lesson-template').innerHTML;
var lessonsContainer = document.querySelector('.lessons');
var doneContainer = document.querySelector('.done');

var renderLessons = function () {
    lessonsContainer.innerHTML = '';
    doneContainer.innerHTML = '';

    state.forEach(function(lesson) {
        var element = compileTemplate(lessonTemplate, lesson);
        var target = lesson.completed ? doneContainer : lessonsContainer;
        target.appendChild(element);
    });
};

var handleDoneClicked = function (target) {
    var id = Number(target.dataset.id);
    state.filter(function (x) {
        return x.id === id;
    })[0].completed = target.checked;

    setLocalStorageState(state);

    renderLessons();
}

on('click', lessonsContainer, 'input[type="checkbox"]', handleDoneClicked);
on('click', doneContainer, 'input[type="checkbox"]', handleDoneClicked);

renderLessons();
