/**
 * A hash function is any function that can be used to
 * map data of arbitrary size to fixed-size values.
 * https://en.wikipedia.org/wiki/Hash_function
 */

import SparkMD5 from 'spark-md5'

/**
 * SparkMD5 is a fast md5 implementation of the MD5 algorithm.
 * This script is based in the JKM md5 library which is the
 * fastest algorithm around. This is most suitable for browser usage,
 * because nodejs version might be faster.
 * https://github.com/satazor/js-spark-md5
 */

const spark = new SparkMD5()

spark.append('Muro planta baja')
spark.append('')
