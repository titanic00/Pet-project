import webp from "gulp-webp";
import imagemin from "gulp-imagemin";

export const images = () => {
    return app.gulp.src(app.path.src.images)
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "HTML",
                message: "Error: <%= error.message %>"
            })
        ))
        // вызываем наш newer и проверяем картинки в папке с результатом
        // чтобы обрабатывать только то, что изменилось или которых еще нет
        .pipe(app.plugins.newer(app.path.build.images))
        // создаем изображение webp
        .pipe(
            app.plugins.if(
                app.isBuild,
                webp()
            )
        )
        // когда изображение созданы, выгружаем их в папку с результатом
        .pipe(
            app.plugins.if(
                app.isBuild,
                app.gulp.dest(app.path.build.images)
            )
        )
        // далее нужно опять получить доступ к изображениям в папке с исходниками
        // и опять проверить на обновления
        .pipe(
            app.plugins.if(
                app.isBuild,
                app.gulp.src(app.path.src.images)
            )
        )
        .pipe(app.plugins.if(
            app.isBuild,
            app.plugins.newer(app.path.build.images)
        ))
        // создаем задачу, с помощью которой мы будем сжимать картинки
        .pipe(app.plugins.if(
            app.isBuild,
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true,
                optimizationLevel: 3 // 0 to 7
            })
        ))
        // выгружаем оптимизированные картинки в папку с результатом
        .pipe(app.gulp.dest(app.path.build.images))
        // добавляем еще 2 действия. Получаем доступ к svg
        .pipe(app.gulp.src(app.path.src.svg))
        // копируем их в изображения в папке с результатом
        .pipe(app.gulp.dest(app.path.build.images))
        .pipe(app.plugins.browsersync.stream())
}

