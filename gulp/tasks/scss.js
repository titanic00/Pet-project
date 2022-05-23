import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';

import cleanCss from 'gulp-clean-css';
import webpcss from 'gulp-webpcss';
import autoprefixer from 'gulp-autoprefixer';
import groupCssMediaQueries from 'gulp-group-css-media-queries';

// делаем вызов из плагина gulpSass с передачей компилятора dartSass
const sass = gulpSass(dartSass);

export const scss = () => {
    return app.gulp.src(app.path.src.scss, { sourcemaps: app.isDev })
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "HTML",
                message: "Error: <%= error.message %>"
            })
        ))
        .pipe(app.plugins.replace(/@img\//g, '../img/'))
        // вызываем наш компилятор
        .pipe(sass({
            outputStyle: 'expanded' //изначальный стиль готового файла
        }))
        // после компиляции начинаем его прокачивать
        .pipe(
            app.plugins.if(
                app.isBuild,
                groupCssMediaQueries()
            )
        )
        // webp картинки
        .pipe(app.plugins.if(
            app.isBuild,
            webpcss(
                {
                    webpClass: ".webp", // если браузер поддерживает webp
                    noWebpClass: ".no-webp" // если браузер не поддерживает webp
                }
            )
        ))
        // автопрефиксер
        .pipe(
            app.plugins.if(
                app.isBuild,
                autoprefixer({
                    grid: true,
                    overrideBrowserslist: ["last 3 versions"], // количество версий у браузера
                    cascade: true
                })
            )
        )
        // Раскомментировать если нужен не сжатый дубль файла стилей
        .pipe(app.gulp.dest(app.path.build.css))
        .pipe(app.plugins.if(
            app.isBuild,
            cleanCss()
        ))
        //
        .pipe(rename({
            extname: ".min.css"
        }))
        .pipe(app.gulp.dest(app.path.build.css))
        .pipe(app.plugins.browsersync.stream());
}